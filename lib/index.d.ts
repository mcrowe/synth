export interface IEnvelope {
    attack: number;
    sustain: number;
    decay: number;
    fade: number;
    release: number;
}
export interface IPatch {
    envelope: IEnvelope;
    harmonics: number[];
}
export declare const PIANO_PATCH: {
    envelope: {
        attack: number;
        sustain: number;
        decay: number;
        fade: number;
        release: number;
    };
    harmonics: number[];
};
declare class Synth {
    patch: IPatch;
    ctx: AudioContext;
    constructor(patch: IPatch);
    play(freq: number, gain: number): void;
    private playHarmonic(freq, gain);
    private createSineOscillatorNode(freq);
    private createEnvelopeGainNode(gain);
}
export default Synth;
