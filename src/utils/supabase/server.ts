import { createServerClient } from '@supabase/ssr'

export async function createClient() {
  // Cookies are not accessed here to keep compatibility with both server and client contexts.
  // If cookies are needed, they can be passed explicitly from server components.
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
        cookies: {
          getAll() { return [] },
          setAll(_cookiesToSet) { /* no-op */ }
        },
    }
  )
}
