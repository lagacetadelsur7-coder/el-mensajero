'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
interface SubmitCommentState {
  success: boolean;
  error?: string;
  message?: string;
}

export async function submitComment(prevState: SubmitCommentState, formData: FormData) {
  try {
    const articuloId = formData.get('articuloId') as string
    const nick = formData.get('nick') as string
    const comentario = formData.get('comentario') as string

    if (!articuloId || !nick || !nick.trim() || !comentario || !comentario.trim()) {
      return { success: false, error: 'Todos los campos son obligatorios.' }
    }

    const supabase = await createClient()

    const { error } = await supabase.from('comentarios').insert({
      articulo_id: articuloId,
      nick: nick.trim(),
      comentario: comentario.trim(),
      aprobado: false // All user-submitted comments are unapproved by default
    })

    if (error) {
      console.error('Database error when saving comment:', error)
      return { success: false, error: 'Hubo un error al guardar tu comentario. Por favor, intenta de nuevo.' }
    }

    // Refresh the page data
    revalidatePath(`/articulo/${articuloId}`)

    return { 
      success: true, 
      message: '¡Comentario enviado con éxito! Se publicará una vez que sea aprobado por los editores.' 
    }
  } catch (error) {
    console.error('Action error when saving comment:', error)
    return { success: false, error: 'Ocurrió un error inesperado al procesar tu comentario.' }
  }
}
