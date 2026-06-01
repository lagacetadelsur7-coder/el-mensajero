export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  link: string;
  source: string;
  category: string;
}

import Parser from 'rss-parser'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/utils/supabase/server'

const parser = new Parser()
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)

const RSS_FEEDS = [
  { url: 'https://www.lavoz.com.ar/resizer/rss/locales/', category: 'Locales', source: 'La Voz (CBA)' },
  { url: 'https://www.puntal.com.ar/rss/rio-cuarto.xml', category: 'Locales', source: 'Puntal (RC)' },
  { url: 'https://www.infobae.com/pf/api/v3/content/fetch/rss-feed?query=%7B%22feedOffset%22%3A0%2C%22feedQuery%22%3A%22%22%2C%22feedSize%22%3A10%2C%22sort%22%3A%22display_date%3Adesc%22%7D&d=154&_website=infobae', category: 'Actualidad', source: 'Infobae' },
  // Add more relevant feeds as needed
]

// Fetch news from RSS
export async function getLatestNews() {
  try {

    
    // Process feeds in parallel
    const feedPromises = RSS_FEEDS.map(async (feed) => {
      try {
        const parsed = await parser.parseURL(feed.url)
        return parsed.items.slice(0, 5).map(item => ({
          id: item.guid || item.link || Math.random().toString(),
          title: item.title || 'Sin título',
          summary: item.contentSnippet?.slice(0, 150) + '...' || 'Sin resumen',
          link: item.link,
          source: feed.source,
          category: feed.category
        }))
      } catch (e) {
        console.error(`Error fetching feed ${feed.url}:`, e)
        return []
      }
    })

    const results = await Promise.all(feedPromises)
    return results.flat()

  } catch (error) {
    console.error('Failed to get latest news:', error)
    return []
  }
}

// Process selected news with AI
export async function processNewsWithAI(items: NewsItem[]) {
  const supabase = await createClient()

  // 1. Get columnists to assign personalities
  const { data: columnistas } = await supabase.from('columnistas').select('*')
  
  if (!columnistas || columnistas.length === 0) {
    throw new Error('No hay columnistas configurados en la base de datos.')
  }

  const processed = []

  for (const item of items) {
    try {
      // Find a matching columnist or pick a random one
      const columnista = columnistas.find(c => c.seccion_asignada === item.category) || columnistas[Math.floor(Math.random() * columnistas.length)]

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

      const prompt = `
        Actúa como un periodista experto. Tu nombre es ${columnista.nombre} y tu profesión/estilo es: "${columnista.profesion}".
        Escribes para la sección "${item.category}" del semanario digital "El Mensajero", un medio premium y vanguardista.
        
        Aquí tienes la información base de una noticia reciente obtenida de ${item.source}:
        Título original: ${item.title}
        Resumen/Contenido: ${item.summary}
        
        Tu tarea es:
        1. REESCRIBIR POR COMPLETO esta noticia desde cero. Está PROHIBIDO copiar texto original.
        2. Adoptar fuertemente tu personalidad y estilo asignado (${columnista.profesion}).
        3. Crear un Título atrapante, directo y periodístico.
        4. Crear un Subtítulo (bajada) que complemente al título aportando el dato clave.
        5. Escribir el cuerpo de la noticia (al menos 3 a 5 párrafos bien desarrollados).
        
        Guía de tono por sección (APLICA ESTRICTAMENTE EL TONO DE "${item.category}"):
        - "Locales": Cercano, informativo, enfocado en el impacto a la comunidad de Río Cuarto y Córdoba.
        - "Política Internacional": Analítico, geopolítico, objetivo, evaluando consecuencias globales.
        - "Actualidad": Ágil, dinámico, enfocado en las tendencias y el acontecer nacional o económico.
        - "Espectáculos": Fresco, cultural, entretenido, con estilo de revista premium.
        - "Supernatural": Oscuro, misterioso, intrigante, utilizando recursos literarios de suspense, gnosticismo y teorías alternativas.
        
        Devuelve el resultado ESTRICTAMENTE en este formato JSON (sin markdown code blocks, solo el JSON puro, asegúrate de escapar comillas si es necesario):
        {
          "titulo": "...",
          "subtitulo": "...",
          "cuerpo": "Párrafo 1\\n\\nPárrafo 2\\n\\nPárrafo 3..."
        }
      `

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      // Clean JSON string
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim()
      const generatedContent = JSON.parse(jsonStr)

      // Save to database as draft
      const { data, error } = await supabase.from('articulos').insert({
        titulo: generatedContent.titulo,
        subtitulo: generatedContent.subtitulo,
        cuerpo: generatedContent.cuerpo,
        categoria: item.category,
        subcategoria: 'General', // Can be refined later
        estado: 'borrador',
        columnista_id: columnista.id,
        // Mock image URL based on category
        imagen_url: item.category === 'Supernatural' 
          ? 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800' 
          : 'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=800'
      }).select().single()

      if (error) throw error
      processed.push(data)

    } catch (err) {
      console.error(`Error processing news item ${item.title}:`, err)
    }
  }

  return processed
}
