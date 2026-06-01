'use client';
import { useState } from 'react';
import { login, signup } from '@/app/revision/login/actions';
import { RefreshCw, Plus, CheckCircle2, Sparkles } from 'lucide-react';
import { getLatestNews, processNewsWithAI } from '../actions/news';
import type { NewsItem } from '../actions/news';

type Titular = {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  link?: string;
};

export default function RedaccionPage() {
  // Estado para el login de editores
  const [showEditorLogin, setShowEditorLogin] = useState(false);

  // Estado del newsroom
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [titulares, setTitulares] = useState<Titular[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const fetchNews = async () => {
    setLoading(true);
    try {
      const news = await getLatestNews();
      setTitulares(news);
    } catch (e) {
      console.error(e);
      alert('Error al actualizar titulares.');
    }
    setLoading(false);
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelected(newSelected);
  };

  const handleProcessNews = async () => {
    if (selected.size === 0) return;
    setProcessing(true);
    const itemsToProcess: NewsItem[] = titulares
      .filter(t => selected.has(t.id))
      .map(t => ({
        id: t.id,
        title: t.title,
        summary: t.summary,
        link: t.link ?? '',
        source: t.source,
        category: t.category,
      }));
    try {
      await processNewsWithAI(itemsToProcess);
      setTitulares(titulares.filter(t => !selected.has(t.id)));
      setSelected(new Set());
      alert('Las noticias seleccionadas fueron redactadas por la IA (Gemini) y guardadas como Borradores.');
    } catch (e) {
      console.error(e);
      alert('Hubo un error al procesar con la IA. Verifica si la clave API de Gemini está configurada.');
    }
    setProcessing(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800 px-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Branding del semanario */}
        <div className="text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded">
            Sala de Redacción
          </span>
          <h1 className="text-4xl font-serif font-black tracking-tight text-slate-900 mt-3 leading-none">
            EL MENSAJERO
          </h1>
          <p className="text-slate-400 text-xs mt-2 uppercase font-bold tracking-wider">
            Control Editorial
          </p>
        </div>

        {/* Botón de login para editores */}
        <button
          type="button"
          onClick={() => setShowEditorLogin(!showEditorLogin)}
          className="text-sm text-cyan-600 underline hover:text-cyan-800 transition-colors duration-200"
        >
          Login Editores
        </button>

        {/* Formulario condicional */}
        {showEditorLogin && (
          <form className="space-y-4 bg-white p-6 rounded-2xl shadow border border-slate-200">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Usuario (César o Laura)
              </label>
              <input
                id="email"
                name="email"
                type="text"
                required
                
                className="flex h-10 w-full rounded-xl border border-slate-250 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-colors"
              />
            </div>
            <div className="space-y-1.5 mt-2">
              <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Contraseña (clave común)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                
                className="flex h-10 w-full rounded-xl border border-slate-250 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2 pt-4">
              <button
                formAction={login}
                className="inline-flex items-center justify-center rounded-xl text-sm font-bold uppercase tracking-wider transition-all bg-neutral-900 text-white hover:bg-neutral-800 h-11 px-5 shadow-sm"
              >
                Ingresar
              </button>
              <button
                formAction={signup}
                className="inline-flex items-center justify-center rounded-xl text-sm font-bold border border-slate-250 bg-white hover:bg-slate-50 text-slate-700 h-11 px-5 shadow-sm"
              >
                Registrarse como Editor
              </button>
            </div>
          </form>
        )}

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-3xl font-serif font-black tracking-tight text-slate-900">
              Newsroom Inteligente
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Recepción en tiempo real de agencias de noticias e integración de redacción automatizada por IA.
            </p>
          </div>
          <button
            onClick={fetchNews}
            disabled={loading || processing}
            className="inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all shadow-sm bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 h-11 px-5"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Buscar Últimas Noticias (RSS)
          </button>
        </div>

        {/* TITULARES CONTAINER */}
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
          {/* Subheader action bar */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-slate-50/50">
            <h2 className="font-serif font-bold text-slate-800 text-base">
              Titulares Disponibles
            </h2>
            {selected.size > 0 && (
              <button
                onClick={handleProcessNews}
                disabled={processing}
                className="inline-flex items-center justify-center gap-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all bg-cyan-600 hover:bg-cyan-700 text-white h-9 px-4 shadow-sm"
              >
                {processing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                {processing ? 'Redactando con Gemini...' : `Redactar Seleccionadas con IA (${selected.size})`}
              </button>
            )}
          </div>
          {/* Main List */}
          <div className="divide-y divide-slate-100">
            {titulares.length === 0 && !loading && (
              <div className="p-12 text-center text-slate-450">
                <p className="font-medium text-sm">Bandeja de entrada vacía.</p>
                <p className="text-xs text-slate-400 mt-1">Presiona el botón superior para buscar noticias frescas en los canales RSS.</p>
              </div>
            )}
            {loading && titulares.length === 0 && (
              <div className="p-12 flex flex-col items-center justify-center gap-3 text-slate-450">
                <RefreshCw className="w-7 h-7 text-cyan-600 animate-spin" />
                <p className="text-xs font-semibold uppercase tracking-wider">Escaneando cables de noticias...</p>
              </div>
            )}
            {titulares.map((titular) => {
              const isSel = selected.has(titular.id);
              return (
                <div
                  key={titular.id}
                  className={`p-5 transition-colors duration-200 ease-in-out flex gap-4 items-start bg-white ${isSel ? 'bg-cyan-50/30' : 'hover:bg-slate-50'}`}
                >
                  {/* Checkbox wrapper */}
                  <div className="pt-1 shrink-0">
                    <input
                      type="checkbox"
                      checked={isSel}
                      onChange={() => toggleSelect(titular.id)}
                      className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                    />
                  </div>
                  {/* Content details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {titular.category}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {titular.source}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 font-serif leading-snug">
                      {titular.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {titular.summary}
                    </p>
                  </div>
                  {/* Button Action */}
                  <div className="shrink-0 self-center">
                    <button
                      onClick={() => toggleSelect(titular.id)}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors duration-200 ease-in-out h-9 px-3.5 border ${
                        isSel ? 'bg-cyan-550 border-cyan-550 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm'
                      }`}
                    >
                      {isSel ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Listo
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-slate-400" />
                          Sumar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
