import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
     "https://kadorwmjhklzakafowpu.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}