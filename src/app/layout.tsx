import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBarClient from "./components/NavBarClient";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "El Mensajero | Semanario Digital",
  description: "Noticias locales, internacionales, espectáculos y supernatural."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Navigation state moved to NavBarClient
  return (
    <html lang="es">
      <body className={`${inter.className} bg-background text-foreground min-h-screen flex flex-col antialiased`}> 
        {/* BRAND HEADER BAR (FRANJA OSCURA CON TITULO NEON Y LOGO) */}
        <div className="w-full bg-neutral-950 py-6 border-b border-neutral-900 text-center flex flex-col items-center justify-center select-none relative overflow-hidden">
          {/* Logo placeholder */}
          <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-2 flex items-center justify-center backdrop-blur-xs shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all">
            <span className="text-cyan-400 font-serif text-sm font-black tracking-wider">EM</span>
          </div>
          <Link href="/" className="text-3xl md:text-5xl font-serif font-black tracking-[0.15em] text-white neon-title-glow uppercase hover:opacity-95 transition-opacity">
            EL MENSAJERO
          </Link>
          <p className="text-[9px] text-neutral-400 tracking-[0.25em] uppercase mt-1 font-extrabold font-sans">
            Semanario de Noticias Inteligente
          </p>
        </div>
        <NavBarClient />

        <main className="flex-1 bg-[#f8fafc]">
          {children}
        </main>

        {/* EDITORIAL FOOTER */}
        <footer className="border-t border-slate-200 bg-white py-12">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="text-2xl font-serif font-black tracking-tighter text-slate-900">
                EL MENSAJERO
              </Link>
              <p className="mt-4 text-sm text-slate-600 max-w-sm leading-relaxed">
                Semanario digital de noticias, análisis, espectáculos y misterios. Información rápida y veraz con un enfoque único.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-wider">Secciones</h3>
              <ul className="space-y-2">
                <li><Link href="/categoria/locales" className="text-sm text-slate-600 hover:text-slate-900">Locales</Link></li>
                <li><Link href="/categoria/internacional" className="text-sm text-slate-600 hover:text-slate-900">Política Internacional</Link></li>
                <li><Link href="/categoria/actualidad" className="text-sm text-slate-600 hover:text-slate-900">Actualidad</Link></li>
                <li><Link href="/categoria/espectaculos" className="text-sm text-slate-600 hover:text-slate-900">Espectáculos</Link></li>
                <li><Link href="/categoria/supernatural" className="text-sm text-slate-600 hover:text-slate-900">Supernatural</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-wider">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/terminos" className="text-sm text-slate-600 hover:text-slate-900">Términos y Condiciones</Link></li>
                <li><Link href="/privacidad" className="text-sm text-slate-600 hover:text-slate-900">Política de Privacidad</Link></li>
                <li><Link href="/revision/login" className="text-sm text-slate-600 hover:text-slate-900 font-semibold text-slate-800">Acceso Editores</Link></li>
              </ul>
            </div>
          </div>
          <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-100 text-center text-xs text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} El Mensajero. Todos los derechos reservados.
          </div>
        </footer>
      </body>
    </html>
  );
}
