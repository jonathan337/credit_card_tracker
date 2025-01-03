import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://poiejcvisuxbjdpvurgi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvaWVqY3Zpc3V4YmpkcHZ1cmdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3NzIxNzMsImV4cCI6MjA1MTM0ODE3M30.eNH9W4SXHyQuQqzpIIuuPkmPg0DsaTVyUDYxK5p4uMI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Simple health check function
export async function checkSupabaseHealth() {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Supabase health check error:', error)
      return { ok: false, error: error.message }
    }
    return { ok: true }
  } catch (err) {
    console.error('Unexpected error during health check:', err)
    return { 
      ok: false, 
      error: err instanceof Error ? err.message : 'Unknown error occurred'
    }
  }
}

