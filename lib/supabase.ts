import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, key)

export interface Lead {
  name: string
  email: string
  company?: string
  tier: 'installations' | 'activations' | 'xr' | 'immersive'
  message?: string
}

export async function submitLead(lead: Lead): Promise<{ error: string | null }> {
  const { error } = await supabase.from('leads').insert(lead)
  return { error: error?.message ?? null }
}
