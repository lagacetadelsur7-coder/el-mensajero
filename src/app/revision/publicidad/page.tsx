'use client'

import { useState, useEffect } from 'react'
import { Megaphone, Plus, Image as ImageIcon, Link as LinkIcon, Power, PowerOff, Edit3, X, Loader2 } from 'lucide-react'
import { getAds, toggleAdActive, saveAd } from '../../actions/revision'

type Publicidad = {
  id: string
  ubicacion: 'header' | 'sidebar' | 'inline'
  imagen_url: string
  enlace_url: string
  activo: boolean
}

export default function PublicidadPage() {
  const [loading, setLoading] = useState(true)
  const [publicidades, setPublicidades] = useState<Publicidad[]>([])
  const [actionId, setActionId] = useState<string | null>(null)
  
  // Modal Editor state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAd, setEditingAd] = useState<Partial<Publicidad> | null>(null)
  const [saving, setSaving] = useState(false)

  const loadAds = async () => {
  try {
    const data = await getAds();
    setPublicidades(data);
  } catch (e) {
    console.error(e);
  }
};

useEffect(() => {
  const fetch = async () => {
    setLoading(true);
    await loadAds();
    setLoading(false);
  };
  fetch();
}, []);

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    setActionId(id)
    try {
      const res = await toggleAdActive(id, !currentActive)
      if (res.success) {
        setPublicidades(publicidades.map(p => p.id === id ? { ...p, activo: !p.activo } : p))
      } else {
        alert('Error al cambiar estado: ' + res.error)
      }
    } catch (e) {
      console.error(e)
    }
    setActionId(null)
  }

  const handleOpenNewModal = () => {
    setEditingAd({
      ubicacion: 'sidebar',
      imagen_url: '',
      enlace_url: '',
      activo: true
    })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (ad: Publicidad) => {
    setEditingAd(ad)
    setIsModalOpen(true)
  }

  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAd || !editingAd.ubicacion || !editingAd.imagen_url || !editingAd.enlace_url) {
      alert('Todos los campos son obligatorios.')
      return
    }

    setSaving(true)
    try {
      const res = await saveAd({
        id: editingAd.id,
        ubicacion: editingAd.ubicacion,
        imagen_url: editingAd.imagen_url.trim(),
        enlace_url: editingAd.enlace_url.trim(),
        activo: editingAd.activo ?? true
      })

      if (res.success) {
        setIsModalOpen(false)
        setEditingAd(null)
        await loadAds() // Reload fresh ads from DB
      } else {
        alert('Error al guardar: ' + res.error)
      }
    } catch (e) {
      console.error(e)
    }
    setSaving(false)
  }

  // Mapping for location display used in UI
  const ubicaciones = {
    header: 'Banner Principal (Header - 728x90)',
    sidebar: 'Barra Lateral (Sidebar - 300x250)',
    inline: 'Entre Párrafos (Inline - 600x120)',
  }

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-serif font-black tracking-tight text-slate-900">
            Gestión de Publicidad
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Administra los banners publicitarios que se muestran a los lectores en portada e interior de artículos.
          </p>
        </div>
        <button
          onClick={handleOpenNewModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all shadow-sm bg-neutral-900 text-white hover:bg-neutral-800 h-11 px-5"
        >
          <Plus className="w-4 h-4" />
          Nueva Publicidad
        </button>
      </div>

      {loading && (
        <div className="p-20 flex flex-col items-center justify-center gap-3 text-slate-450">
          <Loader2 className="w-8 h-8 text-cyan-600 animate-spin" />
          <p className="text-xs font-semibold uppercase tracking-wider">Cargando banners publicitarios&#8230;</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {publicidades.map((pub) => (
            <div 
              key={pub.id} 
              className={`bg-white border rounded-2xl overflow-hidden shadow-sm flex flex-col transition-all ${
                pub.activo ? 'border-slate-250 shadow-sm' : 'border-slate-200 opacity-60'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Megaphone className="w-3.5 h-3.5 text-slate-400" />
                  {ubicaciones[pub.ubicacion]}
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  pub.activo ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                }`}>
                  {pub.activo ? 'ACTIVO' : 'INACTIVO'}
                </span>
              </div>
              
              {/* Card Body / Banner Preview */}
              <div className="p-5 flex-1 flex flex-col gap-4">
                <div className="aspect-video bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 text-xs gap-1">
                    <ImageIcon className="w-6 h-6 text-slate-300" />
                    <span>Sin imagen o error</span>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={pub.imagen_url} 
                    alt="Banner Preview" 
                    className="absolute inset-0 w-full h-full object-cover z-10 hover:scale-105 transition-all duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                
                {/* Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate font-medium">{pub.imagen_url}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate font-semibold text-cyan-600">{pub.enlace_url}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2">
                <button 
                  disabled={actionId === pub.id}
                  onClick={() => handleToggleActive(pub.id, pub.activo)}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all h-9 px-3.5 border ${
                    pub.activo 
                      ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm' 
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm'
                  }`}
                >
                  {actionId === pub.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : pub.activo ? (
                    <>
                      <PowerOff className="w-3.5 h-3.5" />
                      Desactivar
                    </>
                  ) : (
                    <>
                      <Power className="w-3.5 h-3.5" />
                      Activar
                    </>
                  )}
                </button>
                <button 
                  onClick={() => handleOpenEditModal(pub)}
                  className="inline-flex items-center justify-center rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 h-9 px-3 shadow-sm"
                  title="Editar banner"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Add placement Card */}
          <div 
            onClick={handleOpenNewModal}
            className="bg-slate-50 border border-slate-250 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center hover:bg-slate-100/50 transition-all cursor-pointer group min-h-[250px]"
          >
            <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-all shadow-sm">
              <Plus className="w-5 h-5 text-slate-600" />
            </div>
            <h3 className="font-serif font-bold text-slate-800 mb-1">Agregar Banner</h3>
            <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
              Crea un nuevo espacio promocional en las secciones del semanario.
            </p>
          </div>
        </div>
      )}

      {/* DIALOG MODAL */}
      {isModalOpen && editingAd && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-250 w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-serif font-black text-lg text-slate-900">
                {editingAd.id ? 'Editar Banner Publicitario' : 'Nuevo Banner Publicitario'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-250 text-slate-400 hover:text-slate-700 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveAd}>
              <div className="p-6 space-y-4">
                
                {/* Placement */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Ubicación en el Semanario
                  </label>
                  <select
                    value={editingAd.ubicacion}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditingAd({ ...editingAd, ubicacion: e.target.value as keyof typeof ubicaciones })}
                    className="flex h-10 w-full rounded-xl border border-slate-250 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  >
                    <option value="header">Banner Principal (Header - 728x90)</option>
                    <option value="sidebar">Barra Lateral (Sidebar - 300x250)</option>
                    <option value="inline">Entre Párrafos (Inline - 600x120)</option>
                  </select>
                </div>

                {/* Image URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    URL de la Imagen (Banner)
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://ejemplo.com/banners/anuncio.jpg"
                    value={editingAd.imagen_url || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, imagen_url: e.target.value })}
                    className="flex h-10 w-full rounded-xl border border-slate-250 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>

                {/* Click Link URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Enlace de Destino (Al hacer click)
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://anunciante.com"
                    value={editingAd.enlace_url || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, enlace_url: e.target.value })}
                    className="flex h-10 w-full rounded-xl border border-slate-250 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>

                {/* Active switch */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">Estado del Anuncio</span>
                    <span className="text-[10px] text-slate-400">Determina si es visible inmediatamente para los lectores.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={editingAd.activo ?? true}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingAd({ ...editingAd, activo: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                  />
                </div>

              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all h-10 px-4 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all h-10 px-4 bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Guardar Anuncio'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
