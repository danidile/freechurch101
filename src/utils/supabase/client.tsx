import { createBrowserClient } from '@supabase/ssr'
import { secret } from '@aws-amplify/backend';

export function createClient() {
  return createBrowserClient(
    secret('NEXT_PUBLIC_SUPABASE_URL'),
    secret('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  )
}