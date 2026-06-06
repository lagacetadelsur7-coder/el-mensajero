import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export const runtime = 'nodejs';
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function RedaccionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Public view: show single Redacción button linking to login
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800">
        <h1 className="text-4xl font-serif font-black tracking-tight text-slate-900 mb-4">
          EL MENSAJERO
        </h1>
        <Link
          href="/revision/login"
          className="text-sm text-cyan-600 underline hover:text-cyan-800 transition-colors"
        >
          Redacción
        </Link>
      </div>
    );
  }

  // Private editor panel after successful login
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800 p-4">
      <h1 className="text-3xl font-bold mb-4">Panel de Control Editorial</h1>
      <nav className="flex flex-col gap-3 mb-6">
        <Link
          href="/revision/newsroom"
          className="text-base font-medium text-cyan-600 hover:underline"
        >
          Newsroom / IA
        </Link>
        <Link
          href="/revision/borradores"
          className="text-base font-medium text-cyan-600 hover:underline"
        >
          Borradores
        </Link>
        <Link
          href="/revision/moderacion"
          className="text-base font-medium text-cyan-600 hover:underline"
        >
          Moderación
        </Link>
        <Link
          href="/revision/publicidad"
          className="text-base font-medium text-cyan-600 hover:underline"
        >
          Publicidad
        </Link>
      </nav>
      <form method="post" action="/auth/signout" className="mt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Cerrar Sesión
        </button>
      </form>
    </div>
  );
}
