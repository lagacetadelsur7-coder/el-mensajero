// src/app/components/NavBarClient.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";

// Map editor emails to display names
const EMAIL_TO_NAME: Record<string, string> = {
  "cesar@elmensajero.com": "César",
  "laura@elmensajero.com": "Laura",
};

export default function NavBarClient() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }: any) => {
      setUser(user);
    });
  }, []);

  // Determine display name
  const displayName = user ? EMAIL_TO_NAME[user.email ?? ""] || user.email : null;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="container mx-auto px-4 h-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-950"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link
            href="/"
            className="font-serif font-black tracking-tight text-slate-900 text-base hover:text-slate-700 transition-colors"
          >
            EL MENSAJERO
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-950 transition-colors">
            Inicio
          </Link>
          <Link href="/categoria/locales" className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-950 transition-colors">
            Locales
          </Link>
          <Link href="/categoria/internacional" className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-950 transition-colors">
            Internacionales
          </Link>
          <Link href="/categoria/actualidad" className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-950 transition-colors">
            Actualidad
          </Link>
          <Link href="/categoria/espectaculos" className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-950 transition-colors">
            Espectáculos
          </Link>
          <Link href="/categoria/supernatural" className="text-xs font-bold uppercase tracking-wider text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1 font-extrabold">
            ✦ Supernatural
          </Link>
        </nav>
        {user ? (
          <div className="flex items-center gap-4">
            <form method="post" action="/auth/signout" className="inline ml-2">
              <button type="submit" className="text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white px-3.5 py-1.5 rounded-full hover:bg-red-700 transition-colors">
                Logout
              </button>
            </form>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-white px-3.5 py-1.5 rounded-full">
              {displayName}
            </span>
            <Link href="/revision/newsroom" className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-white px-3.5 py-1.5 rounded-full hover:bg-slate-700 transition-colors">
              Newsroom
            </Link>
            <Link href="/revision/borradores" className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-white px-3.5 py-1.5 rounded-full hover:bg-slate-700 transition-colors">
              Borradores
            </Link>
            <Link href="/revision/moderacion" className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-white px-3.5 py-1.5 rounded-full hover:bg-slate-700 transition-colors">
              Moderación
            </Link>
            <Link href="/revision/publicidad" className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-white px-3.5 py-1.5 rounded-full hover:bg-slate-700 transition-colors">
              Publicidad
            </Link>
          </div>
        ) : (
          <Link href="/revision/login" className="text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white px-3.5 py-1.5 rounded-full hover:bg-slate-800 shadow-xs transition-colors">
            Redacción
          </Link>
        )}
      </div>
      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute top-0 left-0 w-64 h-full bg-white shadow-lg p-4"
            onClick={e => e.stopPropagation()}
          >
            <button className="mb-4" onClick={() => setMenuOpen(false)}>
              <X className="w-5 h-5" />
            </button>
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-base font-medium" onClick={() => setMenuOpen(false)}>
                Inicio
              </Link>
              <Link href="/categoria/locales" className="text-base font-medium" onClick={() => setMenuOpen(false)}>
                Locales
              </Link>
              <Link href="/categoria/internacional" className="text-base font-medium" onClick={() => setMenuOpen(false)}>
                Internacionales
              </Link>
              <Link href="/categoria/actualidad" className="text-base font-medium" onClick={() => setMenuOpen(false)}>
                Actualidad
              </Link>
              <Link href="/categoria/espectaculos" className="text-base font-medium" onClick={() => setMenuOpen(false)}>
                Espectáculos
              </Link>
              <Link href="/categoria/supernatural" className="text-base font-medium" onClick={() => setMenuOpen(false)}>
                Supernatural
              </Link>
              {user ? (
                <>
                  <Link href="/revision/newsroom" className="text-base font-medium" onClick={() => setMenuOpen(false)}>
                    Newsroom
                  </Link>
                  <Link href="/revision/borradores" className="text-base font-medium" onClick={() => setMenuOpen(false)}>
                    Borradores
                  </Link>
                  <Link href="/revision/moderacion" className="text-base font-medium" onClick={() => setMenuOpen(false)}>
                    Moderación
                  </Link>
                  <Link href="/revision/publicidad" className="text-base font-medium" onClick={() => setMenuOpen(false)}>
                    Publicidad
                  </Link>
                  <form method="post" action="/auth/signout" className="inline">
                    <button type="submit" className="text-base font-medium">
                      Logout
                    </button>
                  </form>
                </>
              ) : (
                <Link href="/revision/login" className="text-base font-medium" onClick={() => setMenuOpen(false)}>
                  Redacción
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
