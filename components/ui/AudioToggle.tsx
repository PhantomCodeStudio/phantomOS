// components/ui/AudioToggle.tsx
'use client'
import { useStore } from '@/lib/store'
import { audioEngine } from '@/lib/audio/audioEngine'

export function AudioToggle() {
  const { audioEnabled, setAudioEnabled } = useStore()

  const toggle = () => {
    const next = !audioEnabled
    audioEngine.setEnabled(next)
    setAudioEnabled(next)
  }

  return (
    <button
      onClick={toggle}
      aria-label={audioEnabled ? 'Mute audio' : 'Enable audio'}
      className="font-mono text-[0.6rem] tracking-widest uppercase text-black opacity-50 hover:opacity-100 transition-opacity cursor-none"
    >
      {audioEnabled ? 'SND ON' : 'SND OFF'}
    </button>
  )
}
