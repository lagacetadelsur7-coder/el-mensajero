import { createClient } from "@/utils/supabase/server";

// Types for fetched data





import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Clock, ChevronRight, Sparkles, BookOpen, Newspaper, Calendar, ArrowRight } from "lucide-react";

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  const supabase = await createClient();

  // Fetch featured article (most recent published)
  const { data: featuredArticle } = await supabase
    .from("articulos")
    .select(`
      id,
      titulo,
      cuerpo,
      subtitulo,
      cover_title_override,
      categoria,
      imagen_url,
      fecha_creacion,
      columnistas (
        id,
        nombre,
        avatar_url,
        rol
      )
    `)
    .eq("estado", "publicado")
    .order("fecha_creacion", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Fetch 4 recent articles (excluding the featured one if it exists)
  let recentQuery = supabase
    .from("articulos")
    .select(`
      id,
      titulo,
      subtitulo,
      categoria,
      imagen_url,
      fecha_creacion,
      columnistas (
        id,
        nombre
      )
    `)
    .eq("estado", "publicado")
    .order("fecha_creacion", { ascending: false });

  if (featuredArticle) {
    recentQuery = recentQuery.neq("id", featuredArticle.id);
  }

  const { data: recentArticles } = await recentQuery.limit(4);

  // Fetch 3 recent supernatural articles
  const { data: supernaturalArticles } = await supabase
    .from("articulos")
    .select(`
      id,
      titulo,
      imagen_url,
      fecha_creacion
    `)
    .eq("estado", "publicado")
    .eq("categoria", "supernatural")
    .order("fecha_creacion", { ascending: false })
    .limit(3);

  // Fetch active advertisements
  const { data: ads } = await supabase
    .from("publicidades")
    .select("*")
    .eq("activo", true)
    .order("fecha_creacion", { ascending: false });

  const sidebarAd = ads?.find((ad: any) => ad.ubicacion === "portada_lateral");

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      {/* DECORATIVE TOP STRIP */}
      <div className="flex justify-between items-center border-b border-slate-300 pb-2 mb-6 text-[9px] font-bold tracking-[0.2em] text-slate-500 uppercase">
        <span>PRO VERITATE ET SCIENTIA</span>
        <span className="hidden sm:inline">BUENOS AIRES &bull; PRECIO SUGERIDO: GRATUITO &bull; EDICIÓN N° 42</span>
        <span>SEMANARIO INDEPENDIENTE</span>
      </div>

      {/* EDITORIAL MASTHEAD (CABECERA ELEGANTE) */}
      <div className="text-center py-8 border-t-4 border-b-4 border-double border-slate-800 my-4 bg-white relative">
        {/* Decorative corner accents */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-slate-400 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-slate-400 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-slate-400 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-slate-400 pointer-events-none" />

        {/* LOGO DE NEXT.JS - CENTRADO */}
        <div className="flex justify-center mb-5">
          <div className="relative w-24 h-24 md:w-28 md:h-28 flex items-center justify-center border border-dashed border-slate-300 rounded-full bg-slate-50/50 p-2 group hover:border-sky-400 transition-colors">
            <Image
              src="/logo.png"
              alt="Logo El Mensajero"
              width={112}
              height={112}
              className="object-contain max-h-full max-w-full drop-shadow-xs opacity-70 group-hover:opacity-100 transition-opacity"
              unoptimized
            />
            <div className="absolute -inset-1 border border-slate-200/40 rounded-full pointer-events-none group-hover:border-sky-200/50 transition-colors" />
          </div>
        </div>

        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-extrabold mb-3">
          FUNDADO PARA INFORMAR &bull; PERIODISMO DE PRECISIÓN AUTOMATIZADO
        </p>
        
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-black tracking-tight text-slate-900 uppercase select-none leading-none hover:scale-[1.01] transition-transform duration-500 drop-shadow-xs">
          EL MENSAJERO
        </h1>
        
        <p className="text-xs md:text-sm italic text-slate-600 mt-4 font-serif max-w-2xl mx-auto leading-relaxed">
                    La verdad a través de las palabras, de la tierra al firmamento
        </p>
        
        {/* Metadata info line */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 pt-4 mt-8 text-[10px] text-slate-600 font-bold uppercase tracking-widest gap-3 px-4">
          <div className="flex items-center gap-2">
            <span className="text-amber-600 font-black animate-pulse">✦</span>
            <span>Edición Digital</span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-slate-800">Buenos Aires, Argentina</span>
          </div>
          <div className="text-slate-500 hidden md:flex items-center gap-2 font-black tracking-[0.2em]">
            <Newspaper className="w-3.5 h-3.5 text-slate-400" />
            CRÓNICA GENERAL, OPINIÓN & MISTERIO
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* CATEGORIES NAVIGATION */}
      <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-4 border-b border-slate-200 text-[11px] font-bold uppercase tracking-widest text-slate-600 mb-12 bg-white rounded-md shadow-xs">
        <Link href="/" className="hover:text-amber-600 transition-all duration-300 border-b-2 border-amber-600 pb-1 text-slate-950">
          Inicio
        </Link>
        <span className="text-slate-300 select-none">|</span>
        <Link href="/categoria/locales" className="hover:text-amber-600 hover:tracking-[0.11em] transition-all duration-300">
          Locales
        </Link>
        <span className="text-slate-300 select-none">|</span>
        <Link href="/categoria/internacional" className="hover:text-amber-600 hover:tracking-[0.11em] transition-all duration-300">
          Internacionales
        </Link>
        <span className="text-slate-300 select-none">|</span>
        <Link href="/categoria/actualidad" className="hover:text-amber-600 hover:tracking-[0.11em] transition-all duration-300">
          Actualidad
        </Link>
        <span className="text-slate-300 select-none">|</span>
        <Link href="/categoria/espectaculos" className="hover:text-amber-600 hover:tracking-[0.11em] transition-all duration-300">
          Espectáculos
        </Link>
        <span className="text-slate-300 select-none">|</span>
        <Link href="/categoria/supernatural" className="hover:text-purple-700 text-purple-600 transition-all duration-300 flex items-center gap-1 font-extrabold hover:tracking-[0.11em] group-hover:scale-105">
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} /> Supernatural
        </Link>
      </nav>

      {/* FEATURED ARTICLE (HERO STORY - REDISEÑO Clásico Wix) */}
      {featuredArticle && (
        <section className="mb-16 border-b border-slate-200 pb-14">
          <Link href={`/articulo/${featuredArticle.id}`} className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-stretch">
            {/* Lead Story Content (5 Columns) */}
            <div className="lg:col-span-5 flex flex-col justify-between py-2 border-r-0 lg:border-r lg:border-slate-200 lg:pr-8">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-neutral-950 bg-amber-500 rounded-xs shadow-xs">
                    {featuredArticle.categoria}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 flex items-center font-bold">
                    <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    {formatDistanceToNow(new Date(featuredArticle.fecha_creacion), { addSuffix: true, locale: es })}
                  </span>
                </div>
                
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-slate-900 leading-[1.1] mb-5 tracking-tight group-hover:text-amber-600 transition-colors duration-300">
                  {featuredArticle.cover_title_override ?? featuredArticle.titulo}
                </h2>
                
                {/* Vintage Styled Subtitle */}
                {featuredArticle.subtitulo && (
                  <p className="text-slate-700 text-sm md:text-base font-serif leading-relaxed mb-6 italic border-l-2 border-amber-500 pl-4 py-1">
                    {featuredArticle.subtitulo}
                  </p>
                )}
                
                {/* Short Paragraph Preview */}
                <p className="text-slate-600 text-xs md:text-sm font-sans leading-relaxed mb-8 line-clamp-4">
                  {featuredArticle.cuerpo?.replace(/<[^>]*>/g, '').substring(0, 320) + "..."}
                </p>
              </div>
              
              {/* Writer Profile Section */}
              {(featuredArticle.columnistas) && (
                <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-5 mt-auto">
                  <div className="flex items-center gap-3">
                    {featuredArticle.columnistas?.[0]?.avatar_url ? (
                        <Image
                          src={featuredArticle.columnistas?.[0]?.avatar_url || ''}
                          alt={featuredArticle.columnistas?.[0]?.nombre}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs grayscale group-hover:grayscale-0 transition-all duration-300"
                        />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                        {(featuredArticle.columnistas?.[0]?.nombre?.charAt(0))}
                      </div>
                    )}
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Columnista Principal</p>
                      <p className="text-xs font-bold text-slate-800 font-serif">{featuredArticle.columnistas?.[0]?.nombre}</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center text-[10px] font-black uppercase tracking-widest text-amber-600 group-hover:text-amber-700 transition-all gap-1">
                    Leer crónica completa <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              )}
            </div>
            
            {/* Lead Story Visual Frame (7 Columns) */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="relative p-2 bg-white border border-slate-200 rounded-md shadow-md group-hover:border-slate-300 transition-colors duration-500">
                <div className="relative overflow-hidden aspect-[16/10] bg-slate-100">
                  {featuredArticle.imagen_url ? (
                    <Image
                        src={featuredArticle.imagen_url}
                        alt={featuredArticle.titulo}
                        width={800}
                        height={450}
                        className="object-cover grayscale group-hover:grayscale-0 opacity-90 group-hover:opacity-100 group-hover:scale-[1.01] transition-all duration-700"
                        unoptimized
                      />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <span className="text-slate-400 font-serif italic text-sm">El Mensajero Semanario</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-slate-900/5 mix-blend-multiply pointer-events-none" />
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-serif italic mt-3 text-center border-b border-slate-200 pb-3">
                Fotografía que acompaña al reportaje especial de portada de la presente edición.
              </p>
            </div>
          </Link>
        </section>
      )}

      {/* TWO-COLUMN EDITORIAL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* RECENT STORIES (8 COLS) */}
        <div className="lg:col-span-8 lg:border-r lg:border-slate-200 lg:pr-8">
          <div className="flex items-center justify-between mb-8 border-b-2 border-slate-800 pb-3">
            <h3 className="text-xs font-serif font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-amber-500 inline-block"></span> CRÓNICAS & ACTUALIDAD SEMANAL
            </h3>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Últimas Publicaciones
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
            {recentArticles?.map((article: any) => (
              <Link 
                href={`/articulo/${article.id}`} 
                key={article.id} 
                className="group flex flex-col justify-between border-b border-slate-100 pb-8 last:border-0 md:border-b-0 md:pb-0"
              >
                <div>
                  <div className="relative p-1.5 bg-white border border-slate-200 mb-4 rounded-md shadow-xs group-hover:border-slate-300 transition-all duration-300">
                    <div className="aspect-video overflow-hidden bg-slate-50 relative">
                      {article.imagen_url ? (
                        <Image
                      src={article.imagen_url}
                      alt={article.titulo}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500"
                      unoptimized
                    />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                          <span className="text-slate-400 font-serif text-xs italic">El Mensajero News</span>
                        </div>
                      )}
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-slate-800 bg-white border border-slate-200 rounded-xs shadow-xs">
                        {article.categoria}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-[9px] uppercase tracking-wider text-slate-500 mb-2.5 gap-2 font-bold">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDistanceToNow(new Date(article.fecha_creacion), { addSuffix: true, locale: es })}</span>
                    <span className="text-slate-300">&bull;</span>
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-700">{article.columnistas?.[0]?.nombre}</span>
                  </div>
                  
                  <h4 className="text-lg font-serif font-black text-slate-900 leading-snug mb-2 group-hover:text-amber-600 transition-colors duration-300 line-clamp-2">
                    {article.titulo}
                  </h4>
                  
                  <p className="text-slate-600 text-xs font-serif leading-relaxed line-clamp-3">
                    {article.subtitulo || article.titulo}
                  </p>
                </div>
                
                <div className="mt-4 flex items-center text-[10px] font-black uppercase tracking-widest text-amber-600 group-hover:text-amber-700 transition-colors pt-3 border-t border-slate-100">
                  Leer Crónica <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* SIDEBAR: SUPERNATURAL WIDGET & AD BLOCK (4 COLS) */}
        <div className="lg:col-span-4 space-y-12 pl-0 lg:pl-4">
          {/* SUPERNATURAL MYSTICAL BOX */}
          <div className="relative p-6 bg-white border border-purple-100 rounded-md shadow-sm overflow-hidden group/supernatural">
            {/* Glowing radial underlay */}
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Floating widget title */}
            <div className="absolute -top-3.5 left-6 bg-purple-50 px-4 py-0.5 border border-purple-200 rounded-full">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-700 flex items-center gap-1.5">
                <span className="animate-pulse text-purple-600">✦</span> ARCHIVO SUPERNATURAL
              </h3>
            </div>
            
            <div className="mt-4 space-y-6">
              {supernaturalArticles && supernaturalArticles.length > 0 ? (
                supernaturalArticles.map((article: any) => (
                  <Link 
                    href={`/articulo/${article.id}`} 
                    key={article.id} 
                    className="group block border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex gap-4">
                      {/* Mysterious framed thumbnail */}
                      <div className="w-16 h-16 shrink-0 bg-slate-50 border border-purple-100 overflow-hidden relative rounded-xs group-hover:border-purple-400 transition-colors duration-300">
                        {article.imagen_url ? (
                          <Image
                             src={article.imagen_url}
                             alt={article.titulo}
                             width={200}
                             height={150}
                             className="w-full h-full object-cover transition-all duration-500 grayscale group-hover:grayscale-0 opacity-90 group-hover:opacity-100 group-hover:scale-105"
                             unoptimized
                           />
                        ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-purple-500/5 mix-blend-color pointer-events-none" />
                      </div>
                      
                      <div className="flex flex-col justify-center">
                        <h4 className="text-xs font-serif font-bold text-slate-800 leading-snug group-hover:text-purple-700 transition-colors duration-300 line-clamp-2">
                          {article.titulo}
                        </h4>
                        <span className="text-[9px] uppercase tracking-wider text-purple-600/70 font-black mt-1.5 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping"></span>
                          {formatDistanceToNow(new Date(article.fecha_creacion), { addSuffix: true, locale: es })}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-slate-400 text-xs italic">No hay misterios registrados esta semana.</p>
                </div>
              )}
            </div>
            
            {/* Mystical widget entry link */}
            <div className="mt-6 pt-4 border-t border-purple-100 text-center">
              <Link 
                href="/categoria/supernatural" 
                className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.15em] text-purple-700 hover:text-purple-900 transition-all duration-300 hover:gap-1.5 gap-1"
              >
                Ingresar al Archivo <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* SPONSOR / CLASSIC AD SPACE (ESPACIO PUBLICITARIO RETRO) */}
          <div className="border border-slate-200 p-6 text-center bg-white relative rounded-md shadow-xs group/ad">
            <span className="absolute -top-2.5 left-6 bg-[#f8fafc] px-3 text-[9px] text-slate-500 uppercase tracking-widest font-extrabold border-l border-r border-slate-200">
              Publicidad
            </span>
            {sidebarAd ? (
              <a href={sidebarAd.enlace_url || "#"} target="_blank" rel="noopener noreferrer" className="block group/adlink">
                <div className="relative overflow-hidden aspect-[4/3] rounded-md border border-slate-200/80 bg-slate-50">
                  {sidebarAd.imagen_url ? (
                    <Image
                      src={sidebarAd.imagen_url}
                      alt="Anuncio Patrocinado"
                      width={400}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/adlink:scale-[1.03]"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <span className="text-slate-400 font-serif text-xs italic">El Mensajero Sponsor</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-slate-900/5 mix-blend-multiply pointer-events-none" />
                </div>
                <div className="mt-3 text-left">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Patrocinador Semanal</p>
                  <p className="text-xs font-serif font-black text-slate-800 line-clamp-1 group-hover/adlink:text-amber-600 transition-colors">
                    {sidebarAd.enlace_url || "Visitar patrocinador"}
                  </p>
                </div>
              </a>
            ) : (
              <div className="aspect-[4/3] bg-slate-50/50 flex flex-col items-center justify-center border border-slate-200 border-dashed p-5 rounded-md transition-colors duration-300 group-hover/ad:border-slate-300">
                <div className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center mb-3">
                  <span className="text-slate-400 font-serif italic text-xs">M</span>
                </div>
                <p className="text-slate-700 text-xs font-serif italic mb-1.5">El Mensajero Semanario</p>
                <p className="text-slate-500 text-[9px] uppercase tracking-[0.2em] font-black mb-3">ESPACIO COMERCIAL DISPONIBLE</p>
                <p className="text-slate-600 text-[8px] max-w-xs leading-normal font-sans">
                  Para pautas publicitarias en nuestra edición digital e impresa, contactar al departamento comercial de El Mensajero.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
