import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { ArrowLeft, Clock, MessageSquare, Share2, Award, Calendar } from "lucide-react";
import Image from "next/image";
import CommentForm from "@/components/CommentForm";

export const revalidate = 60; // Revalidate every minute

export default async function ArticuloPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch article with the correct columnist column names to prevent DB crashes
  const { data: articulo, error } = await supabase
    .from("articulos")
    .select(`
      *,
      columnistas (
        id,
        nombre,
        profesion,
        seccion_asignada
      )
    `)
    .eq("id", id)
    .single();

  if (error || !articulo) {
    return notFound();
  }

  // Fetch published comments using correct column names (aprobado, fecha)
  const { data: comentarios } = await supabase
    .from("comentarios")
    .select("*")
    .eq("articulo_id", id)
    .eq("aprobado", true)
    .order("fecha", { ascending: true });

  const isSupernatural = articulo.categoria?.toLowerCase() === "supernatural";

  // Columnist fallbacks
  interface Columnist {
  nombre: string;
  profesion: string;
  seccion_asignada?: string;
}
const columnist = articulo.columnistas as Columnist;
  const columnistName = columnist?.nombre || "Redacción El Mensajero";
  const columnistProfession = columnist?.profesion || "Periodista de Investigación";
  const columnistInitials = columnistName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  const columnistBio = columnist
    ? `${columnistName} es columnista especializado en la sección de ${columnist?.seccion_asignada || articulo.categoria}, aportando análisis agudo con enfoque de ${columnistProfession}.`
    : "Análisis y redacción editorial colectiva a cargo del equipo de noticias de El Mensajero Semanario.";

  return (
    <main className={`min-h-screen pb-24 ${isSupernatural ? "bg-purple-50/10" : "bg-slate-50/50"}`}>
      
      {/* ARTICLE HEADER HERO */}
      <div className="relative w-full overflow-hidden bg-neutral-900 border-b border-neutral-200/50 shadow-inner">
        {articulo.imagen_url ? (
          <div className="relative w-full h-[55vh] min-h-[350px]">
            <Image
                src={articulo.imagen_url!}
                alt={articulo.titulo}
                width={800}
                height={500}
                className="w-full h-full object-cover opacity-75 transition-all duration-700 hover:scale-105"
                unoptimized
              />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
          </div>
        ) : (
          <div className="w-full h-[35vh] bg-gradient-to-br from-neutral-900 via-slate-900 to-neutral-950 relative" />
        )}
        
        {/* Back Button Overlay */}
        <div className="absolute top-0 left-0 w-full p-4 z-10">
          <div className="container mx-auto">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm font-medium text-white hover:text-cyan-400 bg-neutral-950/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Link>
          </div>
        </div>

        {/* Floating title in Hero for high visual impact */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm ${
                isSupernatural 
                  ? "bg-purple-600 text-white" 
                  : "bg-cyan-500 text-neutral-950 font-bold"
              }`}>
                {articulo.categoria}
              </span>
              <span className="flex items-center text-xs text-neutral-300 gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                <Calendar className="w-3.5 h-3.5" />
                {formatDistanceToNow(new Date(articulo.fecha_creacion), { addSuffix: true, locale: es })}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-black leading-tight text-white tracking-tight drop-shadow-md">
              {articulo.titulo}
            </h1>
            
            {articulo.subtitulo && (
              <p className="mt-4 text-lg md:text-xl text-neutral-200 font-light leading-relaxed max-w-3xl drop-shadow">
                {articulo.subtitulo}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ARTICLE CONTENT & SIDEBAR */}
      <div className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-5xl mx-auto">
          
          {/* COLUMNIST INFO & SOCIAL ACTIONS (SIDEBAR) */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Columnist Card */}
              <div className={`border rounded-2xl p-6 shadow-sm bg-white transition-all ${
                isSupernatural 
                  ? "border-purple-200/60 shadow-purple-50/50" 
                  : "border-neutral-200"
              }`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg border-2 shrink-0 ${
                    isSupernatural 
                      ? "bg-purple-100 border-purple-300 text-purple-700" 
                      : "bg-cyan-50 border-cyan-200 text-cyan-700"
                  }`}>
                    {columnistInitials}
                  </div>
                  <div>
                    <h5 className="font-serif font-bold text-neutral-900 text-base leading-tight">
                      {columnistName}
                    </h5>
                    <p className="text-xs text-neutral-500 font-medium mt-1 flex items-center gap-1">
                      <Award className="w-3 h-3 text-cyan-600" />
                      {columnistProfession}
                    </p>
                  </div>
                </div>
                
                <p className="text-xs text-neutral-600 leading-relaxed italic border-t border-neutral-100 pt-3">
                   {columnistBio}
                 </p>
              </div>

              {/* Utility / Social Buttons */}
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("¡Enlace copiado al portapapeles!");
                  }}
                  className="flex items-center justify-center w-full gap-2 py-3 px-4 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 transition-all font-semibold text-sm shadow-sm"
                >
                  <Share2 className="w-4 h-4 text-neutral-500" />
                  Compartir Artículo
                </button>
                <a 
                  href="#comentarios" 
                  className={`flex items-center justify-center w-full gap-2 py-3 px-4 rounded-xl text-white transition-all font-semibold text-sm shadow-sm ${
                    isSupernatural 
                      ? "bg-purple-650 hover:bg-purple-700" 
                      : "bg-neutral-900 hover:bg-neutral-850"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Leer Comentarios ({comentarios?.length || 0})
                </a>
              </div>

            </div>
          </div>

          {/* MAIN ARTICLE BODY (EDITORIAL TYPOGRAPHY) */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            
            {/* Article text body */}
            <div className={`prose prose-slate max-w-none text-neutral-800 leading-relaxed font-sans text-[17px] md:text-[18px] ${
              isSupernatural ? "prose-purple font-serif" : ""
            }`}>
              {articulo.cuerpo ? (
                articulo.cuerpo.split('\n').map((paragraph: string, index: number) => {
                  const cleaned = paragraph.trim();
                  if (!cleaned) return null;
                  
                  // Style first paragraph differently for premium editorial look
                  if (index === 0) {
                    return (
                      <p key={index} className="mb-6 text-lg md:text-xl font-serif text-neutral-900 font-medium leading-relaxed first-letter:text-5xl first-letter:font-black first-letter:text-cyan-600 first-letter:mr-3 first-letter:float-left first-letter:font-serif">
                        {cleaned}
                      </p>
                    );
                  }
                  
                  return (
                    <p key={index} className="mb-5 text-neutral-700 leading-relaxed text-justify">
                      {cleaned}
                    </p>
                  );
                })
              ) : (
                <p className="italic text-neutral-400">Este artículo no contiene cuerpo de texto.</p>
              )}
            </div>

            <hr className="my-12 border-neutral-200" />

            {/* COMMENTS LISTING AND FORM */}
            <div id="comentarios" className="scroll-mt-24 space-y-8">
              
              {/* Comment submission form */}
              <CommentForm articuloId={articulo.id} />

              {/* Public comments list */}
              <div className="space-y-6">
                <h3 className="text-xl font-serif font-black text-neutral-950 border-b border-neutral-200 pb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-cyan-600" />
                  Comentarios de la Comunidad ({comentarios?.length || 0})
                </h3>

                {comentarios && comentarios.length > 0 ? (
                  <div className="space-y-4">
                    {comentarios.map((comentario) => {
                      const commInit = comentario.nick?.charAt(0).toUpperCase() || "?";
                      return (
                        <div 
                          key={comentario.id} 
                          className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm transition-all hover:border-neutral-300"
                        >
                          <div className="flex items-center justify-between mb-3 border-b border-neutral-50 pb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-sm border border-slate-200 shrink-0">
                                {commInit}
                              </div>
                              <div>
                                <p className="font-bold text-neutral-900 text-sm">{comentario.nick}</p>
                                <p className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                                  <Clock className="w-3 h-3" />
                                  {comentario.fecha 
                                    ? formatDistanceToNow(new Date(comentario.fecha), { addSuffix: true, locale: es })
                                    : "Hace un momento"
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-neutral-700 leading-relaxed text-sm pl-0">
                            {comentario.comentario}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-neutral-450 bg-white rounded-2xl border border-neutral-200 border-dashed">
                    <p className="font-medium text-sm">No hay comentarios publicados aún.</p>
                    <p className="text-xs text-neutral-400 mt-1">¡Sé el primero en compartir tu opinión enviando el formulario!</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
