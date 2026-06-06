import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function ModeracionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/revision/login');
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800 p-4">
      <h1 className="text-3xl font-bold mb-4">Moderación</h1>
      <p className="text-center">Esta sección está en construcción. Próximamente podrás moderar contenidos.</p>
    </main>
  );
}
