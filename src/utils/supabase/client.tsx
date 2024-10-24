import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    "https://kadorwmjhklzakafowpu.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZG9yd21qaGtsemFrYWZvd3B1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc2OTAzODYsImV4cCI6MjA0MzI2NjM4Nn0.HATaPSw8lCH1I1ETvbK-omIYeW1tzSHOEaAg821PygA"
  )
}