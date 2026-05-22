/**
 * Procedural synth groove — professional, warm, vibrant (Portfolio OS).
 * No audio files; starts after user gesture only.
 */

type StopFn = () => void;

const BPM = 108;
const STEP_MS = (60 / BPM / 4) * 1000;

/** Sparse bass — D minor / F major pocket */
const BASS_SEQ = [
  73.42, 0, 0, 73.42, 0, 87.31, 0, 73.42,
  0, 0, 98, 0, 73.42, 0, 87.31, 0,
];

/** Occasional melodic plucks (not constant arpeggio) */
const PLUCK_SEQ = [
  293.66, 0, 0, 0, 0, 349.23, 0, 0,
  0, 392, 0, 0, 0, 440, 0, 0,
];

let sharedEngine: PortfolioAmbientEngine | null = null;

export function registerPortfolioAudioEngine(
  engine: PortfolioAmbientEngine | null,
): void {
  sharedEngine = engine;
}

export type PortfolioInteractionSound =
  | 'grab'
  | 'drag'
  | 'drop'
  | 'release'
  | 'hover-drive';

export function playPortfolioInteraction(
  type: PortfolioInteractionSound,
): void {
  void sharedEngine?.playInteraction(type);
}

export class PortfolioAmbientEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private stops: StopFn[] = [];
  private stepTimer: ReturnType<typeof setInterval> | null = null;
  private step = 0;
  private musicActive = false;

  get isRunning(): boolean {
    return this.musicActive;
  }

  /** Unlock audio + SFX bus (works even when BEAT is off). */
  private async ensureContext(): Promise<AudioContext | null> {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      return this.ctx;
    }

    const ctx = new AudioContext();
    const master = ctx.createGain();
    master.gain.value = 0.18;

    const sfxBus = ctx.createGain();
    sfxBus.gain.value = 1.35;
    sfxBus.connect(master);
    master.connect(ctx.destination);

    this.ctx = ctx;
    this.master = master;
    this.sfxBus = sfxBus;

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    return ctx;
  }

  /** Stop groove only — keeps context + SFX (BEAT off). */
  stopMusic(): void {
    if (this.stepTimer) {
      clearInterval(this.stepTimer);
      this.stepTimer = null;
    }
    for (const stop of this.stops) stop();
    this.stops = [];
    if (this.musicBus) {
      try {
        this.musicBus.disconnect();
      } catch {
        /* already disconnected */
      }
      this.musicBus = null;
    }
    this.musicActive = false;
    this.step = 0;
  }

  async start(): Promise<void> {
    const ctx = await this.ensureContext();
    if (!ctx || this.musicActive) return;

    const musicBus = ctx.createGain();
    musicBus.gain.value = 0.88;

    const musicFilter = ctx.createBiquadFilter();
    musicFilter.type = 'lowpass';
    musicFilter.frequency.value = 5200;
    musicFilter.Q.value = 0.4;

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -28;
    comp.knee.value = 12;
    comp.ratio.value = 2.2;
    comp.attack.value = 0.012;
    comp.release.value = 0.22;

    const reverbSend = this.createReverbSend(ctx);
    musicBus.connect(musicFilter);
    musicFilter.connect(reverbSend.input);
    reverbSend.output.connect(comp);
    comp.connect(this.master!);

    this.musicBus = musicBus;
    this.musicActive = true;

    this.stops.push(this.startPad(ctx, musicBus));
    this.stops.push(reverbSend.stop);
    this.startSequencer(ctx, musicBus);
  }

  setMuted(muted: boolean): void {
    if (!this.master || !this.ctx) return;
    const level = muted ? 0 : this.musicActive ? 0.14 : 0.18;
    this.master.gain.setTargetAtTime(level, this.ctx.currentTime, 0.1);
  }

  async playInteraction(type: PortfolioInteractionSound): Promise<void> {
    const ctx = await this.ensureContext();
    if (!ctx || !this.sfxBus) return;

    const t = ctx.currentTime;

    switch (type) {
      case 'grab':
        this.playGrab(ctx, t);
        break;
      case 'drag':
        this.playDrag(ctx, t);
        break;
      case 'drop':
        this.playDrop(ctx, t);
        break;
      case 'release':
        this.playRelease(ctx, t);
        break;
      case 'hover-drive':
        this.uiTone(ctx, this.sfxBus, 620, 0.1, 0.05, t);
        break;
      default:
        break;
    }
  }

  dispose(): void {
    this.stopMusic();
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
    this.musicBus = null;
    this.sfxBus = null;
    this.musicActive = false;
    this.step = 0;
  }

  private playGrab(ctx: AudioContext, t: number): void {
    if (!this.sfxBus) return;
    this.uiTone(ctx, this.sfxBus, 280, 0.14, 0.05, t, 'sine');
    this.sweepTone(ctx, this.sfxBus, 280, 520, 0.2, 0.12, t);
    this.clickNoise(ctx, this.sfxBus, 0.12, 0.04, t);
  }

  private playDrag(ctx: AudioContext, t: number): void {
    if (!this.sfxBus) return;
    this.uiTone(ctx, this.sfxBus, 920, 0.09, 0.035, t, 'triangle');
  }

  private playDrop(ctx: AudioContext, t: number): void {
    if (!this.sfxBus) return;
    this.uiTone(ctx, this.sfxBus, 110, 0.22, 0.1, t, 'sine');
    this.sweepTone(ctx, this.sfxBus, 440, 659.25, 0.24, 0.16, t + 0.04);
    this.uiTone(ctx, this.sfxBus, 880, 0.16, 0.14, t + 0.1, 'sine');
    this.clickNoise(ctx, this.sfxBus, 0.14, 0.05, t + 0.02);
  }

  private playRelease(ctx: AudioContext, t: number): void {
    if (!this.sfxBus) return;
    this.sweepTone(ctx, this.sfxBus, 480, 260, 0.16, 0.14, t);
    this.uiTone(ctx, this.sfxBus, 180, 0.12, 0.08, t + 0.02, 'sine');
  }

  private createReverbSend(ctx: AudioContext): {
    input: GainNode;
    output: GainNode;
    stop: StopFn;
  } {
    const input = ctx.createGain();
    const wet = ctx.createGain();
    wet.gain.value = 0.22;
    const dry = ctx.createGain();
    dry.gain.value = 1;

    const delay = ctx.createDelay(0.5);
    delay.delayTime.value = 0.21;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.28;
    const damp = ctx.createBiquadFilter();
    damp.type = 'lowpass';
    damp.frequency.value = 2200;

    const output = ctx.createGain();

    input.connect(dry);
    dry.connect(output);
    input.connect(delay);
    delay.connect(damp);
    damp.connect(feedback);
    feedback.connect(delay);
    damp.connect(wet);
    wet.connect(output);

    return {
      input,
      output,
      stop: () => {
        input.disconnect();
        output.disconnect();
        delay.disconnect();
      },
    };
  }

  private uiTone(
    ctx: AudioContext,
    dest: GainNode,
    hz: number,
    peak: number,
    duration: number,
    time: number,
    type: OscillatorType = 'sine',
  ): void {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(hz, time);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0, time);
    env.gain.linearRampToValueAtTime(peak, time + 0.01);
    env.gain.exponentialRampToValueAtTime(0.001, time + duration);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 4800;

    osc.connect(filter);
    filter.connect(env);
    env.connect(dest);
    osc.start(time);
    osc.stop(time + duration + 0.02);
  }

  private sweepTone(
    ctx: AudioContext,
    dest: GainNode,
    fromHz: number,
    toHz: number,
    peak: number,
    duration: number,
    time: number,
  ): void {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(fromHz, time);
    osc.frequency.exponentialRampToValueAtTime(toHz, time + duration);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0, time);
    env.gain.linearRampToValueAtTime(peak, time + 0.015);
    env.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(env);
    env.connect(dest);
    osc.start(time);
    osc.stop(time + duration + 0.02);
  }

  private clickNoise(
    ctx: AudioContext,
    dest: GainNode,
    peak: number,
    duration: number,
    time: number,
  ): void {
    const len = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const env = ctx.createGain();
    env.gain.setValueAtTime(peak, time);
    env.gain.exponentialRampToValueAtTime(0.001, time + duration);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2400;
    filter.Q.value = 0.8;

    noise.connect(filter);
    filter.connect(env);
    env.connect(dest);
    noise.start(time);
    noise.stop(time + duration + 0.01);
  }

  private startPad(ctx: AudioContext, bus: GainNode): StopFn {
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1100;
    filter.Q.value = 0.5;
    filter.connect(bus);

    /** Dm9 → Bb → F → C — warm, mature progression */
    const chords = [
      [146.83, 174.61, 220, 261.63],
      [116.54, 146.83, 174.61, 233.08],
      [87.31, 130.81, 174.61, 220],
      [130.81, 164.81, 196, 261.63],
    ];
    let chordIdx = 0;
    const voices: OscillatorNode[] = [];

    const playChord = () => {
      for (const v of voices) {
        try {
          v.stop();
        } catch {
          /* stopped */
        }
      }
      voices.length = 0;

      const freqs = chords[chordIdx % chords.length];
      chordIdx += 1;
      const t = ctx.currentTime;
      const barLen = (60 / BPM) * 4;

      for (const freq of freqs) {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.045, t + 0.12);
        g.gain.linearRampToValueAtTime(0.038, t + barLen * 0.6);
        g.gain.linearRampToValueAtTime(0, t + barLen * 0.95);
        osc.connect(g);
        g.connect(filter);
        osc.start(t);
        osc.stop(t + barLen);
        voices.push(osc);
      }
    };

    playChord();
    const chordTimer = setInterval(playChord, (60 / BPM) * 1000 * 4);

    return () => {
      clearInterval(chordTimer);
      for (const v of voices) {
        try {
          v.stop();
        } catch {
          /* noop */
        }
      }
      filter.disconnect();
    };
  }

  private startSequencer(ctx: AudioContext, bus: GainNode): void {
    const bassGain = ctx.createGain();
    bassGain.gain.value = 0.42;
    bassGain.connect(bus);

    const pluckGain = ctx.createGain();
    pluckGain.gain.value = 0.28;
    pluckGain.connect(bus);

    const drumGain = ctx.createGain();
    drumGain.gain.value = 0.32;
    drumGain.connect(bus);

    this.stepTimer = setInterval(() => {
      const s = this.step % 16;
      const t = ctx.currentTime;

      if (s % 4 === 0) this.playKick(ctx, drumGain, t);
      if (s % 8 === 4) this.playClick(ctx, drumGain, t);
      if (s % 2 === 1) this.playShaker(ctx, drumGain, t);

      const bassHz = BASS_SEQ[s];
      if (bassHz > 0) this.playBass(ctx, bassGain, bassHz, t);

      const pluckHz = PLUCK_SEQ[s];
      if (pluckHz > 0) this.playPluck(ctx, pluckGain, pluckHz, t);

      this.step += 1;
    }, STEP_MS);
  }

  private playKick(ctx: AudioContext, dest: GainNode, t: number): void {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.exponentialRampToValueAtTime(42, t + 0.1);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.55, t);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(env);
    env.connect(dest);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  private playClick(ctx: AudioContext, dest: GainNode, t: number): void {
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.04);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.2, t);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800;
    filter.Q.value = 1.2;

    osc.connect(filter);
    filter.connect(env);
    env.connect(dest);
    osc.start(t);
    osc.stop(t + 0.06);
  }

  private playShaker(ctx: AudioContext, dest: GainNode, t: number): void {
    const len = Math.floor(ctx.sampleRate * 0.04);
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / len) * 0.6;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.08, t);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7500;

    noise.connect(filter);
    filter.connect(env);
    env.connect(dest);
    noise.start(t);
    noise.stop(t + 0.04);
  }

  private playBass(
    ctx: AudioContext,
    dest: GainNode,
    hz: number,
    t: number,
  ): void {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = hz;

    const sub = ctx.createOscillator();
    sub.type = 'triangle';
    sub.frequency.value = hz;

    const mix = ctx.createGain();
    mix.gain.value = 0.35;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 320;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(0.55, t + 0.02);
    env.gain.setValueAtTime(0.4, t + 0.08);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc.connect(mix);
    sub.connect(mix);
    mix.connect(filter);
    filter.connect(env);
    env.connect(dest);
    osc.start(t);
    sub.start(t);
    osc.stop(t + 0.24);
    sub.stop(t + 0.24);
  }

  private playPluck(
    ctx: AudioContext,
    dest: GainNode,
    hz: number,
    t: number,
  ): void {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(hz * 1.002, t);
    osc.frequency.exponentialRampToValueAtTime(hz, t + 0.06);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(0.22, t + 0.015);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2800;

    osc.connect(filter);
    filter.connect(env);
    env.connect(dest);
    osc.start(t);
    osc.stop(t + 0.3);
  }
}
