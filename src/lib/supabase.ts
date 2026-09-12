import { createClient } from '@supabase/supabase-js';

const fallbackUrl = 'https://nllkmunqdkznhnhfrric.supabase.co';
const fallbackPublishableKey = 'sb_publishable_sEfaduAFppFtdtm5tEAerA_bcpMpbKF';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || fallbackUrl;
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || fallbackPublishableKey;

const nativeFetch = globalThis.fetch.bind(globalThis);

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  global: {
    // Keep Supabase's own network calls on the untouched browser fetch so our
    // application API wrapper below cannot recursively intercept them.
    fetch: nativeFetch,
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

let authenticatedApiFetchInstalled = false;

/**
 * Adds the active Supabase access token to Nirnay's protected same-origin API
 * calls. This lets the Express server verify the signed-in user before using
 * paid/server-side services such as Gemini.
 */
export function installAuthenticatedApiFetch(): void {
  if (authenticatedApiFetchInstalled || typeof window === 'undefined') return;
  authenticatedApiFetchInstalled = true;

  globalThis.fetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
    try {
      const requestUrl =
        input instanceof Request
          ? new URL(input.url, window.location.origin)
          : new URL(String(input), window.location.origin);

      const isProtectedNirnayApi =
        requestUrl.origin === window.location.origin &&
        requestUrl.pathname.startsWith('/api/ai/');

      if (isProtectedNirnayApi) {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.access_token) {
          const headers = new Headers(input instanceof Request ? input.headers : undefined);
          new Headers(init.headers).forEach((value, key) => headers.set(key, value));
          headers.set('Authorization', `Bearer ${session.access_token}`);

          return nativeFetch(input, { ...init, headers });
        }
      }
    } catch {
      // Fall through to the original request. Unauthenticated AI calls receive
      // the deterministic demo response from the server.
    }

    return nativeFetch(input, init);
  };
}

export const SUPABASE_PROJECT_URL = supabaseUrl;
