import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function NewsroomPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/revision/login');
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800 p-4">
      <h1 className="text-3xl font-bold mb-4">Newsroom / IA</h1>
      <p className="text-center">Esta sección está en construcción. Próximamente encontrarás contenido editorial y herramientas de IA.</p>
    </main>
  );
}
