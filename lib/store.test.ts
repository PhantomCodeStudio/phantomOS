import { describe, it, expect } from 'vitest'
import { useStore } from './store'

describe('useStore', () => {
  it('initializes with correct defaults', () => {
    const state = useStore.getState()
    expect(state.loading).toBe(true)
    expect(state.audioEnabled).toBe(false)
    expect(state.reducedMotion).toBe(false)
    expect(state.scrollProgress).toBe(0)
  })

  it('setLoading updates loading flag', () => {
    useStore.getState().setLoading(false)
    expect(useStore.getState().loading).toBe(false)
    useStore.getState().setLoading(true)
  })

  it('setAudioEnabled toggles audio', () => {
    useStore.getState().setAudioEnabled(true)
    expect(useStore.getState().audioEnabled).toBe(true)
    useStore.getState().setAudioEnabled(false)
  })

  it('setScrollProgress clamps to 0-1', () => {
    useStore.getState().setScrollProgress(0.5)
    expect(useStore.getState().scrollProgress).toBe(0.5)
  })
})
