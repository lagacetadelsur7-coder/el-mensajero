export function createClient() {
  return {
    auth: {
      getUser: async () => {
        // Read cookie directly in browser since it's not httpOnly
        if (typeof document !== 'undefined') {
          const match = document.cookie.match(/(?:^|; )editor_session=([^;]*)/);
          const email = match ? decodeURIComponent(match[1]) : null;
          if (email) return { data: { user: { email } }, error: null };
        }
        return { data: { user: null }, error: null };
      }
    }
  } as any;
}
