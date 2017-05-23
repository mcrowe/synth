export interface IEnvelope {
  attack: number
  sustain: number
  decay: number
  fade: number
  release: number
}


export interface IPatch {
  envelope: IEnvelope
  harmonics: number[]
}


export const PIANO_PATCH = {
  envelope: {
    attack: 0.01,
    sustain: 0.9,
    decay: 0.7,
    fade: 0.3,
    release: 1
  },
  harmonics: [1, 0.9, 0.8, 0.7, 0.5, 0.03, 0.02, 0.01]
}


class Synth {

  patch: IPatch
  ctx: AudioContext

  constructor(patch: IPatch) {
    this.patch = patch
    this.ctx = new AudioContext()
  }

  play(freq: number, gain: number) {
    for (let i = 0; i < this.patch.harmonics.length; i++) {
      this.playHarmonic(freq * (i + 1), gain * this.patch.harmonics[i])
    }
  }

  private playHarmonic(freq: number, gain: number) {
    const osc = this.createSineOscillatorNode(freq)
    const master = this.createEnvelopeGainNode(gain)
    osc.connect(master)
    master.connect(this.ctx.destination)
    osc.start(this.ctx.currentTime)
    osc.stop(this.ctx.currentTime + 5000)
  }

  private createSineOscillatorNode(freq: number): OscillatorNode {
    const node = this.ctx.createOscillator()
    node.type = 'sine'
    node.frequency.value = freq
    return node
  }

  private createEnvelopeGainNode(gain: number): GainNode {
    const env = this.patch.envelope
    const t0 = this.ctx.currentTime
    const node = this.ctx.createGain()
    node.gain.setValueAtTime(0, t0)
    node.gain.linearRampToValueAtTime(gain, t0 + env.attack)
    node.gain.linearRampToValueAtTime(gain * env.sustain, t0 + env.attack + env.decay)
    if (env.fade > 0) {
      node.gain.linearRampToValueAtTime(0, t0 + env.attack + env.decay + env.fade)
    }
    return node
  }

}


export default Synth