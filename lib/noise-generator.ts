// Web Audio API based noise generator
export class NoiseGenerator {
  private audioContext: AudioContext | null = null
  private oscillator: OscillatorNode | null = null
  private gainNode: GainNode | null = null
  private bufferSource: AudioBufferSourceNode | null = null
  private isPlaying = false

  async initialize() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  async generateWhiteNoise(duration = 2) {
    await this.initialize()
    if (!this.audioContext) return

    const bufferSize = this.audioContext.sampleRate * duration
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    return buffer
  }

  async generateBrownNoise(duration = 2) {
    await this.initialize()
    if (!this.audioContext) return

    const bufferSize = this.audioContext.sampleRate * duration
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    let lastOut = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      data[i] = (lastOut + 0.02 * white) / 1.02
      lastOut = data[i]
      data[i] *= 3.5
    }

    return buffer
  }

  async playNoise(noiseType: "white" | "brown", volume = 0.5) {
    await this.initialize()
    if (!this.audioContext) return

    this.stop()

    const buffer = noiseType === "white" ? await this.generateWhiteNoise(2) : await this.generateBrownNoise(2)

    if (!buffer) return

    this.bufferSource = this.audioContext.createBufferSource()
    this.bufferSource.buffer = buffer
    this.bufferSource.loop = true

    this.gainNode = this.audioContext.createGain()
    this.gainNode.gain.value = volume / 100

    this.bufferSource.connect(this.gainNode)
    this.gainNode.connect(this.audioContext.destination)
    this.bufferSource.start(0)

    this.isPlaying = true
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = volume / 100
    }
  }

  stop() {
    if (this.bufferSource && this.isPlaying) {
      this.bufferSource.stop()
      this.isPlaying = false
    }
  }

  getIsPlaying() {
    return this.isPlaying
  }
}
