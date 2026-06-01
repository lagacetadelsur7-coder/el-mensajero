'use client'

import { useState, useEffect } from 'react'
import { Newspaper, Check, Trash2, Calendar, FileText, Eye, X, Loader2 } from 'lucide-react'
import Image from "next/image"
import { getDrafts, publishDraft, deleteDraft } from '../../actions/revision'

type Articulo = {
  id: string
  titulo: string
  subtitulo: string
  cuerpo: string
  categoria: string
  subcategoria: string
  imagen_url: string
  estado: string
  fecha: string
  columnista: string
}

export default function BorradoresPage() {
  const [loading, setLoading] = useState(true)
  const [articulos, setArticulos] = useState<Articulo[]>([])
  const [selectedArticulo, setSelectedArticulo] = useState<Articulo | null>(null)
  const [publishingId, setPublishingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const loadDrafts = async () => {
    setLoading(true)
    try {
      const drafts = await getDrafts()
      setArticulos(drafts)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => {
    const fetch = async () => {
      await loadDrafts()
    }
    fetch()
  }, [])

  const handlePublish = async (id: string) => {
    setPublishingId(id)
    try {
      const res = await publishDraft(id)
      if (res.success) {
        setArticulos(articulos.filter(a => a.id !== id))
        if (selectedArticulo?.id === id) {
          setSelectedArticulo(null)
        }
      } else {
        alert('Error al publicar: ' + res.error)
      }
    } catch (e) {
      console.error(e)
    }
    setPublishingId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este borrador permanentemente?')) return
    setDeletingId(id)
    try {
      const res = await deleteDraft(id)
      if (res.success) {
        setArticulos(articulos.filter(a => a.id !== id))
        if (selectedArticulo?.id === id) {
          setSelectedArticulo(null)
        }
      } else {
        alert('Error al descartar: ' + res.error)
      }
    } catch (e) {
      console.error(e)
    }
    setDeletingId(null)
  }

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-serif font-black tracking-tight text-slate-900">
          Borradores Pendientes
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Artículos redactados por la IA pendientes de tu aprobación final para entrar en portada.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LIST SECTION */}
        <div className={`space-y-4 lg:col-span-7 transition-all ${selectedArticulo ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-slate-450" />
                <h2 className="font-serif font-bold text-slate-800 text-base">Bandeja de Entrada</h2>
              </div>
              <span className="bg-slate-200 text-slate-800 text-xs font-bold px-2 py-1 rounded-full">
                {articulos.length}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {loading && (
                <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-450">
                  <Loader2 className="w-7 h-7 text-cyan-600 animate-spin" />
                  <p className="text-xs font-semibold uppercase tracking-wider">Cargando borradores...</p>
                </div>
              )}

              {!loading && articulos.length === 0 && (
                <div className="p-16 text-center text-slate-450">
                  <FileText className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                  <p className="font-semibold text-sm">No hay borradores pendientes</p>
                  <p className="text-xs text-slate-400 mt-1">Dirígete a la sección &quot;Newsroom&quot; para buscar y redactar noticias nuevas con la IA.</p>
                </div>
              )}

              {!loading && articulos.map((articulo) => {
                const isSelected = selectedArticulo?.id === articulo.id
                return (
                  <div 
                    key={articulo.id} 
                    className={`p-5 transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4 cursor-pointer ${
                      isSelected ? 'bg-cyan-50/30' : 'hover:bg-slate-50/40'
                    }`}
                    onClick={() => setSelectedArticulo(articulo)}
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {articulo.categoria}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">Por {articulo.columnista}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 font-serif leading-snug truncate">
                        {articulo.titulo}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {articulo.fecha}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 sm:self-center shrink-0" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedArticulo(articulo)}
                        className={`p-2 rounded-xl border transition-all ${
                          isSelected 
                            ? 'bg-cyan-600 border-cyan-600 text-white shadow-sm' 
                            : 'bg-white hover:bg-slate-50 border-slate-250 text-slate-600 shadow-sm'
                        }`}
                        title="Ver vista previa"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        disabled={deletingId === articulo.id || publishingId === articulo.id}
                        onClick={() => handleDelete(articulo.id)}
                        className="p-2 rounded-xl bg-white hover:bg-red-50 border border-slate-250 hover:border-red-200 text-slate-500 hover:text-red-600 transition-all shadow-sm"
                        title="Descartar borrador"
                      >
                        {deletingId === articulo.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        disabled={publishingId === articulo.id || deletingId === articulo.id}
                        onClick={() => handlePublish(articulo.id)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all h-9 px-3.5 shadow-sm bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50"
                      >
                        {publishingId === articulo.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        Publicar
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* PREVIEW PANEL SECTION */}
        {selectedArticulo && (
          <div className="lg:col-span-5 bg-white border border-slate-250 rounded-2xl shadow-md overflow-hidden sticky top-8 animate-in slide-in-from-right-4 duration-300">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cyan-600" />
                Vista Previa del Borrador
              </span>
              <button 
                onClick={() => setSelectedArticulo(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Scrollable Contents */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-250px)]">
              {/* Category Badge & Columnist */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 bg-neutral-950 text-white rounded">
                  {selectedArticulo.categoria}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  Redactor: <span className="text-slate-800 font-bold">{selectedArticulo.columnista}</span>
                </span>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-3">
                <h1 className="text-2xl font-serif font-black tracking-tight text-slate-900 leading-tight">
                  {selectedArticulo.titulo}
                </h1>
                {selectedArticulo.subtitulo && (
                  <p className="text-base font-serif text-slate-600 leading-normal italic border-l-2 border-slate-300 pl-4">
                    {selectedArticulo.subtitulo}
                  </p>
                )}
              </div>

              {/* Cover Image */}
              {selectedArticulo.imagen_url && (
                <div className="rounded-xl overflow-hidden aspect-video border border-slate-100 relative bg-slate-100">
                  <Image
                        src={selectedArticulo.imagen_url!}
                        alt="Portada"
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                </div>
              )}

              {/* Body */}
              <div className="prose prose-slate max-w-none">
                {selectedArticulo.cuerpo.split('\n\n').map((paragraph, index) => (
                  <p 
                    key={index} 
                    className="text-slate-700 font-serif leading-relaxed text-sm text-justify mb-4"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button
                disabled={deletingId === selectedArticulo.id || publishingId === selectedArticulo.id}
                onClick={() => handleDelete(selectedArticulo.id)}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all h-10 px-4 bg-white hover:bg-red-50 border border-slate-250 hover:border-red-200 text-slate-600 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
                Descartar
              </button>
              <button
                disabled={publishingId === selectedArticulo.id || deletingId === selectedArticulo.id}
                onClick={() => handlePublish(selectedArticulo.id)}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all h-10 px-4 bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm"
              >
                <Check className="w-4 h-4" />
                Publicar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
