/**
 * Production-Grade Interactive Sound Engine for ILumaa E-Commerce & Storefronts
 * Features:
 * 1. playAddToCartSound: Tactile luxury pop/plink when adding products to bag
 * 2. playOrderConfirmedSound: Triumphant celestial chord when an order is placed
 * 3. Auto-unlock on first user interaction for 100% browser autoplay policy compliance
 * 4. Dual-mode synthesis (Web Audio API + fallback embedded WAV)
 */

let sharedAudioCtx = null;
let isAudioUnlocked = false;

// Pre-synthesized Add to Cart WAV (Base64)
const ADD_TO_CART_WAV = (() => {
  if (typeof window === "undefined") return "";
  try {
    const sampleRate = 22050;
    const duration = 0.18;
    const numSamples = Math.floor(sampleRate * duration);
    const header = [
      0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0,
      0x57, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 16, 0, 0, 0, 1, 0, 1, 0,
      0x22, 0x56, 0, 0, 0x44, 0xac, 0, 0, 2, 0, 16, 0,
      0x64, 0x61, 0x74, 0x61, 0, 0, 0, 0
    ];
    const dataSize = numSamples * 2;
    const totalSize = 36 + dataSize;
    header[4] = totalSize & 0xff;
    header[5] = (totalSize >> 8) & 0xff;
    header[6] = (totalSize >> 16) & 0xff;
    header[7] = (totalSize >> 24) & 0xff;
    header[40] = dataSize & 0xff;
    header[41] = (dataSize >> 8) & 0xff;
    header[42] = (dataSize >> 16) & 0xff;
    header[43] = (dataSize >> 24) & 0xff;

    const bytes = new Uint8Array(44 + dataSize);
    bytes.set(header, 0);
    let offset = 44;
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const env = Math.exp(-22 * t);
      const freq = 680 + t * 2400;
      const s = Math.max(-1, Math.min(1, 0.75 * Math.sin(2 * Math.PI * freq * t) * env));
      const val = Math.floor(s * 32767);
      bytes[offset++] = val & 0xff;
      bytes[offset++] = (val >> 8) & 0xff;
    }
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return `data:audio/wav;base64,${btoa(binary)}`;
  } catch (_) {
    return "";
  }
})();

// Pre-synthesized Order Confirmed WAV (Base64)
const ORDER_CONFIRMED_WAV = (() => {
  if (typeof window === "undefined") return "";
  try {
    const sampleRate = 22050;
    const duration = 0.8;
    const numSamples = Math.floor(sampleRate * duration);
    const header = [
      0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0,
      0x57, 0x41, 0x56, 0x45,
      0x66, 0x6d, 0x74, 0x20, 16, 0, 0, 0, 1, 0, 1, 0,
      0x22, 0x56, 0, 0, 0x44, 0xac, 0, 0, 2, 0, 16, 0,
      0x64, 0x61, 0x74, 0x61, 0, 0, 0, 0
    ];
    const dataSize = numSamples * 2;
    const totalSize = 36 + dataSize;
    header[4] = totalSize & 0xff;
    header[5] = (totalSize >> 8) & 0xff;
    header[6] = (totalSize >> 16) & 0xff;
    header[7] = (totalSize >> 24) & 0xff;
    header[40] = dataSize & 0xff;
    header[41] = (dataSize >> 8) & 0xff;
    header[42] = (dataSize >> 16) & 0xff;
    header[43] = (dataSize >> 24) & 0xff;

    const bytes = new Uint8Array(44 + dataSize);
    bytes.set(header, 0);
    let offset = 44;
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      let s = 0.25 * Math.sin(2 * Math.PI * 523.25 * t) * Math.exp(-5 * t);
      if (t >= 0.08) s += 0.3 * Math.sin(2 * Math.PI * 659.25 * (t - 0.08)) * Math.exp(-5 * (t - 0.08));
      if (t >= 0.16) s += 0.35 * Math.sin(2 * Math.PI * 783.99 * (t - 0.16)) * Math.exp(-4.5 * (t - 0.16));
      if (t >= 0.24) s += 0.45 * Math.sin(2 * Math.PI * 1046.5 * (t - 0.24)) * Math.exp(-3.5 * (t - 0.24));
      const val = Math.floor(Math.max(-1, Math.min(1, s)) * 32767);
      bytes[offset++] = val & 0xff;
      bytes[offset++] = (val >> 8) & 0xff;
    }
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return `data:audio/wav;base64,${btoa(binary)}`;
  } catch (_) {
    return "";
  }
})();

export const unlockAudio = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!sharedAudioCtx && AudioContextClass) {
      sharedAudioCtx = new AudioContextClass();
    }
    if (sharedAudioCtx && sharedAudioCtx.state === "suspended") {
      sharedAudioCtx.resume().catch(() => {});
    }
    if (sharedAudioCtx && !isAudioUnlocked) {
      const silentBuffer = sharedAudioCtx.createBuffer(1, 1, 22050);
      const source = sharedAudioCtx.createBufferSource();
      source.buffer = silentBuffer;
      source.connect(sharedAudioCtx.destination);
      source.start(0);
      isAudioUnlocked = true;
    }
  } catch (_) {}
};

// Auto-register unlock listener on first user interaction
if (typeof window !== "undefined") {
  const events = ["click", "touchstart", "keydown", "mousedown"];
  const handleInteraction = () => {
    unlockAudio();
    events.forEach((ev) => window.removeEventListener(ev, handleInteraction));
  };
  events.forEach((ev) => window.addEventListener(ev, handleInteraction, { passive: true, capture: true }));
}

/**
 * Play tactile luxury "Add to Cart" pop/plink sound
 */
export const playAddToCartSound = () => {
  try {
    if (typeof localStorage !== "undefined" && localStorage.getItem("cart_sound_muted") === "true") {
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!sharedAudioCtx && AudioContextClass) {
      sharedAudioCtx = new AudioContextClass();
    }

    if (sharedAudioCtx) {
      if (sharedAudioCtx.state === "suspended") {
        sharedAudioCtx.resume().catch(() => {});
      }

      const now = sharedAudioCtx.currentTime;

      // Primary oscillator: quick ascending bubble pop
      const osc = sharedAudioCtx.createOscillator();
      const gain = sharedAudioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(680, now);
      osc.frequency.exponentialRampToValueAtTime(1150, now + 0.06);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(sharedAudioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.16);

      // Shimmer harmonic overtone (crystal touch)
      const osc2 = sharedAudioCtx.createOscillator();
      const gain2 = sharedAudioCtx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1760, now + 0.02);
      gain2.gain.setValueAtTime(0.001, now + 0.02);
      gain2.gain.linearRampToValueAtTime(0.12, now + 0.035);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc2.connect(gain2);
      gain2.connect(sharedAudioCtx.destination);
      osc2.start(now + 0.02);
      osc2.stop(now + 0.15);
      return;
    }

    // HTML5 Audio Fallback
    if (ADD_TO_CART_WAV) {
      const audio = new Audio(ADD_TO_CART_WAV);
      audio.volume = 0.7;
      audio.play().catch(() => {});
    }
  } catch (_) {
    if (ADD_TO_CART_WAV) {
      try {
        const audio = new Audio(ADD_TO_CART_WAV);
        audio.volume = 0.7;
        audio.play().catch(() => {});
      } catch (e) {}
    }
  }
};

/**
 * Play celestial victory chord when order is placed / confirmed
 */
export const playOrderConfirmedSound = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!sharedAudioCtx && AudioContextClass) {
      sharedAudioCtx = new AudioContextClass();
    }

    if (sharedAudioCtx) {
      if (sharedAudioCtx.state === "suspended") {
        sharedAudioCtx.resume().catch(() => {});
      }

      const now = sharedAudioCtx.currentTime;

      // Play celestial ascending chord: C5 -> E5 -> G5 -> C6
      const notes = [
        { freq: 523.25, time: 0.00, dur: 0.6, gain: 0.25 }, // C5
        { freq: 659.25, time: 0.08, dur: 0.65, gain: 0.28 }, // E5
        { freq: 783.99, time: 0.16, dur: 0.7, gain: 0.32 }, // G5
        { freq: 1046.5, time: 0.24, dur: 0.85, gain: 0.42 }, // High C6 (crystal bell)
        { freq: 2093.0, time: 0.25, dur: 0.45, gain: 0.12 }, // Shimmer overtone
      ];

      notes.forEach(({ freq, time, dur, gain: targetGain }) => {
        const start = now + time;
        const osc = sharedAudioCtx.createOscillator();
        const gainNode = sharedAudioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);

        gainNode.gain.setValueAtTime(0.0001, start);
        gainNode.gain.linearRampToValueAtTime(targetGain, start + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, start + dur);

        osc.connect(gainNode);
        gainNode.connect(sharedAudioCtx.destination);

        osc.start(start);
        osc.stop(start + dur);
      });

      // Warm bass foundation
      const bassOsc = sharedAudioCtx.createOscillator();
      const bassGain = sharedAudioCtx.createGain();
      bassOsc.type = "triangle";
      bassOsc.frequency.setValueAtTime(261.63, now + 0.05); // C4 warm root
      bassGain.gain.setValueAtTime(0.001, now + 0.05);
      bassGain.gain.linearRampToValueAtTime(0.2, now + 0.1);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      bassOsc.connect(bassGain);
      bassGain.connect(sharedAudioCtx.destination);
      bassOsc.start(now + 0.05);
      bassOsc.stop(now + 0.68);
      return;
    }

    if (ORDER_CONFIRMED_WAV) {
      const audio = new Audio(ORDER_CONFIRMED_WAV);
      audio.volume = 0.85;
      audio.play().catch(() => {});
    }
  } catch (_) {
    if (ORDER_CONFIRMED_WAV) {
      try {
        const audio = new Audio(ORDER_CONFIRMED_WAV);
        audio.volume = 0.85;
        audio.play().catch(() => {});
      } catch (e) {}
    }
  }
};
