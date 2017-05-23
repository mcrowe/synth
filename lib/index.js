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
var Synth = (function () {
    function Synth(patch) {
        this.patch = patch;
        this.ctx = new AudioContext();
    }
    Synth.prototype.play = function (freq, gain) {
        for (var i = 0; i < this.patch.harmonics.length; i++) {
            this.playHarmonic(freq * (i + 1), gain * this.patch.harmonics[i]);
        }
    };
    Synth.prototype.playHarmonic = function (freq, gain) {
        var osc = this.createSineOscillatorNode(freq);
        var master = this.createEnvelopeGainNode(gain);
        osc.connect(master);
        master.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 5000);
    };
    Synth.prototype.createSineOscillatorNode = function (freq) {
        var node = this.ctx.createOscillator();
        node.type = 'sine';
        node.frequency.value = freq;
        return node;
    };
    Synth.prototype.createEnvelopeGainNode = function (gain) {
        var env = this.patch.envelope;
        var t0 = this.ctx.currentTime;
        var node = this.ctx.createGain();
        node.gain.setValueAtTime(0, t0);
        node.gain.linearRampToValueAtTime(gain, t0 + env.attack);
        node.gain.linearRampToValueAtTime(gain * env.sustain, t0 + env.attack + env.decay);
        if (env.fade > 0) {
            node.gain.linearRampToValueAtTime(0, t0 + env.attack + env.decay + env.fade);
        }
        return node;
    };
    return Synth;
}());
exports.default = Synth;
