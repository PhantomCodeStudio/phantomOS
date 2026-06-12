import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

function getClient(): SupabaseClient | null {
  if (_client) return _client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key || url.startsWith('your_') || key.startsWith('your_')) return null
  _client = createClient(url, key)
  return _client
}

export interface Lead {
  name: string
  email: string
  company?: string
  tier: 'installations' | 'activations' | 'xr' | 'immersive'
  message?: string
}

export async function submitLead(lead: Lead): Promise<{ error: string | null }> {
  const client = getClient()
  if (!client) return { error: 'Supabase not configured' }
  const { error } = await client.from('leads').insert(lead)
  return { error: error?.message ?? null }
}
