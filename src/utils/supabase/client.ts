import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const realAuth = client.auth;
  client.auth = {
    ...realAuth,
    getUser: async () => {
      // Read cookie directly in browser since it's not httpOnly
      if (typeof document !== 'undefined') {
        const match = document.cookie.match(/(?:^|; )editor_session=([^;]*)/);
        const email = match ? decodeURIComponent(match[1]) : null;
        if (email) return { data: { user: { email } }, error: null };
      }
      return { data: { user: null }, error: null };
    }
  } as any;

  return client;
}
