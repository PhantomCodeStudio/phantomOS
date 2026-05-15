'use client'
import { useState } from 'react'
import { submitLead } from '@/lib/supabase'
import { audioEngine } from '@/lib/audio/audioEngine'

const TIERS = [
  { id: 'installations', label: 'Interactive Installations' },
  { id: 'activations',   label: 'Brand Activations' },
  { id: 'xr',           label: 'XR Experiences' },
  { id: 'immersive',    label: 'Full Immersive' },
]

export function ContactForm({ onSuccess }: { onSuccess?: () => void }) {
  const [form, setForm]   = useState({ name: '', email: '', company: '', tier: 'installations' as const, message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) return
    setStatus('loading')
    const { error } = await submitLead(form)
    if (error) { setStatus('error'); return }
    setStatus('success')
    audioEngine.playFormSuccess()
    onSuccess?.()
    setTimeout(() => { setForm({ name: '', email: '', company: '', tier: 'installations', message: '' }); setStatus('idle') }, 3000)
  }

  const inputClass = "w-full bg-transparent border-b border-black/20 py-3 text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-[#4169FF] transition-colors"

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <p className="font-mono text-sm tracking-widest">Message received.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6 max-w-md" aria-label="Contact form">
      <input required placeholder="Name" value={form.name} onChange={set('name')} className={inputClass} />
      <input required type="email" placeholder="Email" value={form.email} onChange={set('email')} className={inputClass} />
      <input placeholder="Company" value={form.company} onChange={set('company')} className={inputClass} />

      <fieldset className="border-none p-0">
        <legend className="font-mono text-[0.6rem] tracking-widest uppercase text-black/40 mb-3">Service Tier</legend>
        <div className="flex flex-col gap-2">
          {TIERS.map((t) => (
            <label key={t.id} className="flex items-center gap-3 cursor-none group">
              <input
                type="radio" name="tier" value={t.id}
                checked={form.tier === t.id}
                onChange={() => setForm((f) => ({ ...f, tier: t.id as any }))}
                className="sr-only"
              />
              <span className={`w-1.5 h-1.5 rounded-full transition-colors ${form.tier === t.id ? 'bg-black' : 'bg-black/20'}`} />
              <span className="text-sm font-light text-black/70 group-hover:text-black transition-colors">{t.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <textarea placeholder="Message" value={form.message} onChange={set('message')} rows={4} className={inputClass + ' resize-none'} />

      <button
        type="submit"
        disabled={status === 'loading'}
        className="font-mono text-sm tracking-widest uppercase text-black border-b border-black/20 pb-2 text-left hover:border-[#4169FF] transition-colors cursor-none disabled:opacity-40"
      >
        {status === 'loading' ? 'Sending...' : status === 'error' ? 'Error — try again' : 'Send Message →'}
      </button>
    </form>
  )
}
