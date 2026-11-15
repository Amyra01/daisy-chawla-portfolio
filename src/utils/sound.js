// Procedural Web Audio API sound synthesizer for Daisy's 3D Motherboard World
// Starts automatically on first user gesture and respects global mute toggle.

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = true; // default muted until user unmutes or interacts
    this.engineOsc = null;
    this.engineGain = null;
    this.ambientOsc = null;
    this.ambientGain = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.initialized = true;

      // Continuous subtle engine hum
      this.engineOsc = this.ctx.createOscillator();
      this.engineGain = this.ctx.createGain();
      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.value = 48;
      this.engineGain.gain.value = 0;

      // Low-pass filter so engine sounds warm, not harsh
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 180;

      this.engineOsc.connect(filter);
      filter.connect(this.engineGain);
      this.engineGain.connect(this.ctx.destination);
      this.engineOsc.start();
    } catch {
      // Ignore autoplay restrictions until user clicks/presses a key
    }
  }

  ensureContext() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setMuted(muted) {
    this.muted = muted;
    if (!muted) {
      this.ensureContext();
    } else if (this.engineGain && this.ctx) {
      this.engineGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.08);
    }
  }

  updateEngine(speedKmh = 0, nitro = false) {
    if (this.muted || !this.ctx || !this.engineOsc || !this.engineGain) return;
    const now = this.ctx.currentTime;
    const norm = Math.min(1, speedKmh / 90);
    const targetFreq = 45 + norm * (nitro ? 135 : 85);
    const targetGain = 0.012 + norm * (nitro ? 0.045 : 0.028);
    this.engineOsc.frequency.setTargetAtTime(targetFreq, now, 0.08);
    this.engineGain.gain.setTargetAtTime(targetGain, now, 0.08);
  }

  playTone(freq = 440, duration = 0.15, type = 'sine', volume = 0.08, endFreq = null) {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (endFreq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);
    }
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  // Soft chime when entering a trigger pad or zone
  playChime() {
    this.playTone(523.25, 0.16, 'sine', 0.06, 659.25);
    setTimeout(() => this.playTone(783.99, 0.22, 'triangle', 0.05, 1046.5), 70);
  }

  // Rising pitch when collecting data bits
  playBitCollect(combo = 0) {
    const base = 440 + (combo % 16) * 45;
    this.playTone(base, 0.12, 'triangle', 0.07, base * 1.35);
  }

  // Boost pad whoosh
  playBoost() {
    this.playTone(140, 0.38, 'sawtooth', 0.07, 680);
  }

  // Metallic clank when hitting skill crates or bowling pins
  playClank(force = 1) {
    const v = Math.min(0.11, Math.max(0.02, force * 0.04));
    this.playTone(220 + Math.random() * 140, 0.11, 'square', v, 85);
  }

  // Horn pulse + shockwave
  playHorn(style = 'cyber') {
    if (style === 'synth') {
      this.playTone(330, 0.28, 'sawtooth', 0.09, 660);
    } else if (style === 'arcade') {
      this.playTone(587, 0.12, 'square', 0.08, 880);
      setTimeout(() => this.playTone(880, 0.18, 'square', 0.08, 1174), 90);
    } else {
      this.playTone(280, 0.25, 'triangle', 0.09, 190);
      this.playTone(420, 0.25, 'sawtooth', 0.06, 380);
    }
  }

  // Golden capacitor firework unlock
  playFirework() {
    [523, 659, 784, 1046, 1318].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 0.22, 'triangle', 0.07, f * 1.15), i * 65);
    });
  }

  // Power surge deep hum
  playPowerSurge() {
    this.playTone(65, 1.1, 'sawtooth', 0.06, 180);
  }
}

export const sound = new SoundEngine();
export default sound;
