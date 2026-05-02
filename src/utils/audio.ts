// Simple audio system with mute toggle stored in localStorage
const KEY = "nature_muted";

export const isMuted = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY) === "1";
};

export const setMuted = (m: boolean) => {
  localStorage.setItem(KEY, m ? "1" : "0");
  window.dispatchEvent(new CustomEvent("nature:mute", { detail: m }));
};

export const toggleMute = () => {
  const next = !isMuted();
  setMuted(next);
  return next;
};

let ctx: AudioContext | null = null;
const getCtx = () => {
  if (typeof window === "undefined") return null;
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return ctx;
};

// Synth tones for UI feedback (no network needed)
export const playTone = (freq: number, duration = 0.15, type: OscillatorType = "sine", gain = 0.15) => {
  if (isMuted()) return;
  const ac = getCtx();
  if (!ac) return;
  
  // Browsers suspend AudioContext until user interaction
  if (ac.state === "suspended") {
    ac.resume();
  }
  
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.value = gain;
  o.connect(g).connect(ac.destination);
  o.start();
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);
  o.stop(ac.currentTime + duration);
};

export const playClick = () => playTone(660, 0.08, "triangle", 0.1);
export const playPop = () => {
  playTone(523, 0.08, "sine", 0.12);
  setTimeout(() => playTone(784, 0.1, "sine", 0.1), 60);
};
export const playSuccess = () => {
  [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => playTone(f, 0.18, "triangle", 0.12), i * 90));
};
export const playWrong = () => {
  playTone(220, 0.18, "sawtooth", 0.1);
  setTimeout(() => playTone(180, 0.22, "sawtooth", 0.1), 120);
};

// Speak word using Web Speech API (reliable, no network needed)
export const speakWord = (enText: string, idText: string, lang: string) => {
  if (isMuted() || typeof window === "undefined" || !window.speechSynthesis) return;
  
  try {
    window.speechSynthesis.cancel(); // stop current
    
    const text = lang === "id" ? idText : enText;
    const u = new SpeechSynthesisUtterance(text);
    
    u.lang = lang === "id" ? "id-ID" : "en-US";
    u.rate = 0.9; // slightly slower for clarity
    u.pitch = 1.1; // slightly playful
    
    window.speechSynthesis.speak(u);
  } catch {
    playPop();
  }
};
