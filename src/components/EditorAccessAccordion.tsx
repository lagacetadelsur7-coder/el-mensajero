import { useState } from 'react';

export default function EditorAccessAccordion() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-sm text-cyan-600 underline hover:text-cyan-800 transition-colors duration-200"
      >
        Acceso a editores
      </button>
      <div
        className={`mt-2 overflow-hidden transition-all duration-200 ${open ? 'max-h-96' : 'max-h-0'}`}
      >
        {open && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold uppercase text-slate-500">Correo 1</label>
              <input
                type="email"
                defaultValue="cesar@elmensajero.com"
                className="flex h-10 w-full rounded-xl border border-slate-250 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold uppercase text-slate-500">Correo 2</label>
              <input
                type="email"
                defaultValue="laura@elmensajero.com"
                className="flex h-10 w-full rounded-xl border border-slate-250 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold uppercase text-slate-500">Clave</label>
              <input
                type="password"
                defaultValue="laliceamor29"
                className="flex h-10 w-full rounded-xl border border-slate-250 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-colors"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
