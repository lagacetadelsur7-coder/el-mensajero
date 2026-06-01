'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Check, Trash2, Loader2, ArrowUpRight, Award, MessageCircle } from 'lucide-react'
import { getComments, approveComment, deleteComment } from '../../actions/revision'

type Comentario = {
  id: string
  articuloId: string
  articuloTitulo: string
  nick: string
  comentario: string
  aprobado: boolean
  fecha: string
}

export default function ComentariosPage() {
  const [loading, setLoading] = useState(true)
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const loadComments = async () => {
    setLoading(true)
    try {
      const data = await getComments()
      setComentarios(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => {
  const fetch = async () => {
    await loadComments()
  }
  fetch()
}, [])

  const handleApprove = async (id: string, articuloId: string) => {
    setApprovingId(id)
    try {
      const res = await approveComment(id, articuloId)
      if (res.success) {
        setComentarios(comentarios.map(c => c.id === id ? { ...c, aprobado: true } : c))
      } else {
        alert('Error al aprobar comentario: ' + res.error)
      }
    } catch (e) {
      console.error(e)
    }
    setApprovingId(null)
  }

  const handleDelete = async (id: string, articuloId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este comentario?')) return
    setDeletingId(id)
    try {
      const res = await deleteComment(id, articuloId)
      if (res.success) {
        setComentarios(comentarios.filter(c => c.id !== id))
      } else {
        alert('Error al eliminar comentario: ' + res.error)
      }
    } catch (e) {
      console.error(e)
    }
    setDeletingId(null)
  }

  const pendientes = comentarios.filter(c => !c.aprobado)
  const aprobados = comentarios.filter(c => c.aprobado)

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-serif font-black tracking-tight text-slate-900">
          Moderación de Comentarios
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Acepta o elimina las contribuciones de tus lectores. Los comentarios son moderados por defecto.
        </p>
      </div>

      {loading && (
        <div className="p-20 flex flex-col items-center justify-center gap-3 text-slate-450">
          <Loader2 className="w-8 h-8 text-cyan-600 animate-spin" />
          <p className="text-xs font-semibold uppercase tracking-wider">Cargando comentarios...</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* PENDING COMMENTS */}
          <div className="bg-white border border-slate-250 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-500" />
                <h2 className="font-serif font-bold text-slate-800 text-base">Pendientes de Aprobación</h2>
              </div>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">
                {pendientes.length}
              </span>
            </div>
            
            <div className="divide-y divide-slate-100 flex-1">
              {pendientes.length === 0 && (
                <div className="p-12 text-center text-slate-450">
                  <MessageCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-xs">No hay comentarios pendientes</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">¡Buen trabajo! Estás al día con la moderación.</p>
                </div>
              )}
              
              {pendientes.map((comentario) => (
                <div key={comentario.id} className="p-5 hover:bg-slate-50/40 transition-all space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{comentario.nick}</span>
                      <span className="text-[10px] text-slate-400 font-semibold ml-2.5">{comentario.fecha}</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    En: <span className="font-semibold text-cyan-600 truncate max-w-[250px]">{comentario.articuloTitulo}</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400 shrink-0" />
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed font-serif bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 italic">
                    <q>{comentario.comentario}</q>
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <button 
                      disabled={approvingId === comentario.id || deletingId === comentario.id}
                      onClick={() => handleApprove(comentario.id, comentario.articuloId)}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all h-9 bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50"
                    >
                      {approvingId === comentario.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      Aprobar
                    </button>
                    <button 
                      disabled={deletingId === comentario.id || approvingId === comentario.id}
                      onClick={() => handleDelete(comentario.id, comentario.articuloId)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl text-xs font-semibold transition-all border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 text-slate-500 hover:text-red-600 h-9 w-9"
                      title="Eliminar comentario"
                    >
                      {deletingId === comentario.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* APPROVED COMMENTS */}
          <div className="bg-white border border-slate-250 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-500" />
                <h2 className="font-serif font-bold text-slate-800 text-base">Comentarios Aprobados</h2>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full">
                {aprobados.length}
              </span>
            </div>
            
            <div className="divide-y divide-slate-100 flex-1">
              {aprobados.length === 0 && (
                <div className="p-12 text-center text-slate-450">
                  <p className="font-semibold text-xs">Aún no has aprobado ningún comentario</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Los comentarios aprobados se listarán aquí.</p>
                </div>
              )}
              
              {aprobados.map((comentario) => (
                <div key={comentario.id} className="p-5 hover:bg-slate-50/40 transition-all space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-800 text-sm">{comentario.nick}</span>
                      <span className="text-[10px] text-slate-400 font-medium ml-2">{comentario.fecha}</span>
                    </div>
                    
                    <button 
                      disabled={deletingId === comentario.id}
                      onClick={() => handleDelete(comentario.id, comentario.articuloId)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      title="Eliminar de la web"
                    >
                      {deletingId === comentario.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  
                  <div className="text-xs text-slate-400">
                    En: <span className="font-medium text-slate-600 truncate max-w-[200px] inline-block align-bottom">{comentario.articuloTitulo}</span>
                  </div>
                  
                  <p className="text-sm text-slate-600 leading-relaxed font-serif">
                    <q>{comentario.comentario}</q>
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
