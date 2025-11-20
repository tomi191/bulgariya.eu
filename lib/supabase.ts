import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const BULGARIA_POPULATION = 6_688_836

export interface Vote {
  id: string
  name: string
  city: string
  email: string
  vote: 'for' | 'against'
  ip_address: string
  user_agent?: string
  created_at: string
}
