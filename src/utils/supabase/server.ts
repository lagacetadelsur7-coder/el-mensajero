'use server'

import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  
  return {
    auth: {
      getUser: async () => {
        const email = cookieStore.get('editor_session')?.value;
        if (email) return { data: { user: { email } }, error: null };
        return { data: { user: null }, error: null };
      },
      signInWithPassword: async ({ email, password }: any) => {
        cookieStore.set('editor_session', email, { path: '/', httpOnly: false });
        return { data: { session: true }, error: null };
      },
      signUp: async ({ email, password }: any) => {
        cookieStore.set('editor_session', email, { path: '/', httpOnly: false });
        return { data: { session: true }, error: null };
      },
      signOut: async () => {
        cookieStore.delete('editor_session');
        return { error: null };
      }
    }
  } as any;
}
