import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGain = { gain: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() }, connect: vi.fn() }
const mockOsc  = { type: '', frequency: { value: 0 }, connect: vi.fn(), start: vi.fn(), stop: vi.fn() }
const mockAnalyser = { fftSize: 0, frequencyBinCount: 128, getFloatFrequencyData: vi.fn(), connect: vi.fn() }
const mockCtx  = {
  state: 'running',
  resume: vi.fn(),
  currentTime: 0,
  destination: {},
  createOscillator: vi.fn(() => ({ ...mockOsc })),
  createGain: vi.fn(() => ({ ...mockGain })),
  createAnalyser: vi.fn(() => ({ ...mockAnalyser })),
}
vi.stubGlobal('AudioContext', vi.fn(function() { return mockCtx }))

import { AudioEngine } from './audioEngine'

describe('AudioEngine', () => {
  let engine: AudioEngine

  beforeEach(() => {
    vi.clearAllMocks()
    engine = new AudioEngine()
  })

  it('does not play when disabled', () => {
    engine.setEnabled(false)
    engine.playHover(100)
    expect(mockCtx.createOscillator).not.toHaveBeenCalled()
  })

  it('plays hover tone when enabled', () => {
    engine.setEnabled(true)
    engine.playHover(300)
    expect(mockCtx.createOscillator).toHaveBeenCalled()
  })

  it('maps yPosition to frequency in 200-600Hz range', () => {
    const freq = engine.yToFrequency(0.5)
    expect(freq).toBeGreaterThanOrEqual(200)
    expect(freq).toBeLessThanOrEqual(600)
  })
})
