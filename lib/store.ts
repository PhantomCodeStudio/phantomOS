import { create } from 'zustand'

interface StoreState {
  loading: boolean
  audioEnabled: boolean
  reducedMotion: boolean
  scrollProgress: number
  setLoading: (v: boolean) => void
  setAudioEnabled: (v: boolean) => void
  setReducedMotion: (v: boolean) => void
  setScrollProgress: (v: number) => void
}

export const useStore = create<StoreState>((set) => ({
  loading: true,
  audioEnabled: false,
  reducedMotion: false,
  scrollProgress: 0,
  setLoading: (v) => set({ loading: v }),
  setAudioEnabled: (v) => set({ audioEnabled: v }),
  setReducedMotion: (v) => set({ reducedMotion: v }),
  setScrollProgress: (v) => set({ scrollProgress: Math.min(1, Math.max(0, v)) }),
}))
