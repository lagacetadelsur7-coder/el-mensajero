import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Sparkles, Clock, BookOpen } from "lucide-react";

export const revalidate = 60;

const CATEGORIAS_VALIDAS = [
  "locales",
  "internacional",
  "actualidad",
  "espectaculos",
  "supernatural"
];

const CATEGORIA_TITULOS: Record<string, string> = {
  "locales": "Noticias Locales",
  "internacional": "Política Internacional",
  "actualidad": "Actualidad",
  "espectaculos": "Espectáculos",
  "supernatural": "Supernatural"
};

export default async function CategoriaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  if (!CATEGORIAS_VALIDAS.includes(slug)) {
    return notFound();
  }

  const supabase = await createClient();

  const { data: articulos } = await supabase
    .from("articulos")
    .select(`
      id,
      titulo,
      subtitulo,
      imagen_url,
      fecha_creacion,
      columnistas (
        nombre
      )
    `)
    .eq("estado", "publicado")
    .eq("categoria", slug)
    .order("fecha_creacion", { ascending: false });

  const isSupernatural = slug === "supernatural";

  return (
    <div className={`min-h-screen ${isSupernatural ? "bg-purple-50/20" : "bg-[#f8fafc]"}`}>
      {/* Editorial Category Header */}
      <div className={`py-12 md:py-16 border-b ${isSupernatural ? "border-purple-200/60 bg-purple-100/10" : "border-slate-200 bg-white"}`}>
        <div className="container mx-auto px-4 text-center">
          {isSupernatural ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-200 text-purple-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "8s" }} /> Archivo Misterioso
            </div>
          ) : null}
          <h1 className={`text-4xl md:text-5xl font-serif font-black tracking-tight mb-4 ${isSupernatural ? "text-purple-900" : "text-slate-900"}`}>
            {CATEGORIA_TITULOS[slug]}
          </h1>
          <p className={`max-w-xl mx-auto text-sm leading-relaxed ${isSupernatural ? "text-purple-800/80" : "text-slate-600"}`}>
            Crónicas, reportajes especiales y opiniones de nuestra mesa de editores sobre {CATEGORIA_TITULOS[slug].toLowerCase()}.
          </p>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {articulos && articulos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articulos.map((article) => (
              <Link 
                href={`/articulo/${article.id}`} 
                key={article.id} 
                className={`group flex flex-col h-full bg-white border rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 ${
                  isSupernatural ? "border-purple-100 hover:border-purple-300" : "border-slate-200/80 hover:border-slate-300"
                }`}
              >
                <div className="aspect-[16/10] overflow-hidden relative bg-slate-50">
                  {article.imagen_url ? (
                    <Image
                      src={article.imagen_url}
                      alt={article.titulo}
                      className={`w-full h-full object-cover transition-all duration-700 ${
                        isSupernatural 
                          ? "grayscale group-hover:grayscale-0 opacity-90 group-hover:opacity-100 group-hover:scale-[1.01]" 
                          : "grayscale group-hover:grayscale-0 opacity-95 group-hover:opacity-100 group-hover:scale-[1.01]"
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <span className="text-slate-400 font-serif italic text-xs">El Mensajero news</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-slate-900/5 mix-blend-multiply pointer-events-none" />
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center text-[10px] text-slate-500 mb-3 gap-2 font-bold uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDistanceToNow(new Date(article.fecha_creacion), { addSuffix: true, locale: es })}</span>
                    <span className="text-slate-300">&bull;</span>
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-700">{article.columnistas?.map(c => c.nombre).join(', ')}</span>
                  </div>
                  
                  <h3 className={`text-lg font-serif font-black leading-snug mb-3 tracking-tight transition-colors ${
                    isSupernatural ? "text-slate-900 group-hover:text-purple-700" : "text-slate-900 group-hover:text-amber-600"
                  }`}>
                    {article.titulo}
                  </h3>
                  
                  <p className="text-slate-600 text-xs font-serif leading-relaxed line-clamp-3 mb-5 flex-1">
                    {article.subtitulo || article.titulo}
                  </p>
                  
                  <span className={`text-[10px] font-black uppercase tracking-widest mt-auto flex items-center gap-1 transition-transform group-hover:translate-x-0.5 duration-300 ${
                    isSupernatural ? "text-purple-700" : "text-amber-600"
                  }`}>
                    Leer artículo <span className="font-sans">&rarr;</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-lg p-6 max-w-lg mx-auto">
            <h3 className="text-xl font-serif font-black text-slate-800 mb-2">Sección sin crónicas</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Los redactores automáticos se encuentran procesando la información. Próximamente publicaremos nuevo contenido en esta categoría.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
