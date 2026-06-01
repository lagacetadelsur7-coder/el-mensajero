/* src/app/revision/layout.tsx */
"use client";

import Link from 'next/link';
import { LayoutDashboard, Newspaper, MessageSquare, Megaphone, LogOut, ArrowLeft } from 'lucide-react';

export default function RevisionLayout({ children }: { children: React.ReactNode }) {
  // Session info placeholder – authentication is optional for local dev
  const sessionEmail = 'Invitado';

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-250 bg-white flex flex-col shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-600 hover:text-cyan-700 transition-colors mb-3">
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al Semanario
          </Link>
          <h2 className="text-xl font-serif font-black tracking-tight text-slate-900">EL MENSAJERO</h2>
          <div className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mt-0.5">Control Editorial</div>
        </div>
        <nav className="flex-1 p-4 space-y-1.5">
          <Link href="/revision" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all font-medium text-sm">
            <LayoutDashboard className="w-4 h-4 text-slate-450" />
            Newsroom / IA
          </Link>
          <Link href="/revision/borradores" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all font-medium text-sm">
            <Newspaper className="w-4 h-4 text-slate-450" />
            Borradores
          </Link>
          <Link href="/revision/comentarios" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all font-medium text-sm">
            <MessageSquare className="w-4 h-4 text-slate-450" />
            Moderación
          </Link>
          <Link href="/revision/publicidad" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all font-medium text-sm">
            <Megaphone className="w-4 h-4 text-slate-450" />
            Publicidad
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="text-xs text-slate-500 font-medium mb-3 px-3 truncate">
            Sesión: <span className="font-bold text-slate-700">{sessionEmail}</span>
          </div>
          {/* Sign‑out button is optional – no server route in local dev */}
          <button className="flex w-full items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all font-semibold text-xs shadow-sm" disabled>
            <LogOut className="w-3.5 h-3.5 text-slate-450" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
