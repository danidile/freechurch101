import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'


export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    "https://kadorwmjhklzakafowpu.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZG9yd21qaGtsemFrYWZvd3B1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc2OTAzODYsImV4cCI6MjA0MzI2NjM4Nn0.HATaPSw8lCH1I1ETvbK-omIYeW1tzSHOEaAg821PygA",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}