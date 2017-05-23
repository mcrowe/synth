"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PIANO_PATCH = {
    envelope: {
        attack: 0.01,
        sustain: 0.9,
        decay: 0.7,
        fade: 0.3,
        release: 1
    },
    harmonics: [1, 0.9, 0.8, 0.7, 0.5, 0.03, 0.02, 0.01]
};
class Synth {
    constructor(patch) {
        this.patch = patch;
        this.ctx = new AudioContext();
    }
    play(freq, gain) {
        for (let i = 0; i < this.patch.harmonics.length; i++) {
            this.playHarmonic(freq * (i + 1), gain * this.patch.harmonics[i]);
        }
    }
    playHarmonic(freq, gain) {
        const osc = this.createSineOscillatorNode(freq);
        const master = this.createEnvelopeGainNode(gain);
        osc.connect(master);
        master.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 5000);
    }
    createSineOscillatorNode(freq) {
        const node = this.ctx.createOscillator();
        node.type = 'sine';
        node.frequency.value = freq;
        return node;
    }
    createEnvelopeGainNode(gain) {
        const env = this.patch.envelope;
        const t0 = this.ctx.currentTime;
        const node = this.ctx.createGain();
        node.gain.setValueAtTime(0, t0);
        node.gain.linearRampToValueAtTime(gain, t0 + env.attack);
        node.gain.linearRampToValueAtTime(gain * env.sustain, t0 + env.attack + env.decay);
        if (env.fade > 0) {
            node.gain.linearRampToValueAtTime(0, t0 + env.attack + env.decay + env.fade);
        }
        return node;
    }
}
exports.default = Synth;
