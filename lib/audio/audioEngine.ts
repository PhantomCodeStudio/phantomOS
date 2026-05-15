export class AudioEngine {
  private ctx: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private enabled = false

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext()
      this.analyser = this.ctx.createAnalyser()
      this.analyser.fftSize = 256
      this.analyser.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') this.ctx.resume()
    return this.ctx
  }

  setEnabled(v: boolean) { this.enabled = v }

  yToFrequency(normalizedY: number): number {
    return 200 + normalizedY * 400
  }

  private tone(freq: number, wave: OscillatorType, duration: number, gain = 0.15) {
    if (!this.enabled) return
    const ctx = this.getCtx()
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    osc.type = wave
    osc.frequency.value = freq
    gainNode.gain.setValueAtTime(gain, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration)
    osc.connect(gainNode)
    gainNode.connect(this.analyser ?? ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  }

  playHover(yPosition: number) {
    this.tone(this.yToFrequency(yPosition), 'sine', 0.08)
  }

  playClick() {
    this.tone(440, 'sine', 0.15)
  }

  playCollision(velocity: number) {
    this.tone(Math.min(velocity * 100, 800), 'sawtooth', 0.05, 0.1)
  }

  playLogoCollision(velocity: number) {
    this.tone(Math.min(velocity * 80, 600), 'triangle', 0.08, 0.1)
  }

  playFormSuccess() {
    ;[261, 329, 392].forEach((freq, i) => {
      setTimeout(() => this.tone(freq, 'sine', 0.3, 0.08), i * 30)
    })
  }

  getFrequencyData(): Float32Array {
    const data = new Float32Array(this.analyser?.frequencyBinCount ?? 128)
    this.analyser?.getFloatFrequencyData(data)
    return data
  }
}

export const audioEngine = new AudioEngine()
