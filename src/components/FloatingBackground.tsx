import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type Particle = { id: number; left: string; delay: string; size: number; emoji: string; duration: string };

interface Props {
  variant?: "sky" | "jungle" | "fruits" | "plants";
}

const emojiByVariant: Record<string, string[]> = {
  sky: ["🦋", "🍃", "🌸", "✨", "🐦"],
  jungle: ["🍃", "🦋", "🌿", "✨"],
  fruits: ["🍎", "🍌", "🍓", "🍊", "✨"],
  plants: ["🌸", "🌼", "🦋", "🌿", "✨"],
};

export const FloatingBackground = ({ variant = "sky" }: Props) => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 8000);
    return () => clearInterval(i);
  }, []);

  const particles: Particle[] = useMemo(() => {
    const list = emojiByVariant[variant];
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i + tick * 100,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      size: 14 + Math.random() * 24,
      emoji: list[Math.floor(Math.random() * list.length)],
      duration: `${10 + Math.random() * 10}s`,
    }));
  }, [variant, tick]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-sky">
      {/* Sun */}
      <motion.div
        className="absolute top-10 right-10 h-32 w-32 rounded-full bg-gradient-sunshine shadow-glow"
        animate={{ scale: [1, 1.05, 1], rotate: [0, 360] }}
        transition={{ scale: { duration: 4, repeat: Infinity }, rotate: { duration: 60, repeat: Infinity, ease: "linear" } }}
      />
      {/* Clouds */}
      <div className="absolute top-16 left-0 text-6xl opacity-80 animate-drift">☁️</div>
      <div className="absolute top-40 left-0 text-5xl opacity-70 animate-drift-rev" style={{ animationDuration: "60s" }}>☁️</div>
      <div className="absolute top-24 left-0 text-4xl opacity-60 animate-drift" style={{ animationDuration: "55s", animationDelay: "-20s" }}>☁️</div>

      {/* Hills */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3">
        <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full" preserveAspectRatio="none">
          <path fill="hsl(142 60% 70%)" d="M0,224L80,213.3C160,203,320,181,480,170.7C640,160,800,160,960,170.7C1120,181,1280,203,1360,213.3L1440,224L1440,320L0,320Z" />
          <path fill="hsl(142 70% 50%)" d="M0,256L80,261.3C160,267,320,277,480,272C640,267,800,245,960,250.7C1120,256,1280,288,1360,304L1440,320L0,320Z" opacity="0.85"/>
        </svg>
      </div>

      {/* Floating particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute -top-10 select-none animate-leaf-fall"
          style={{ left: p.left, fontSize: p.size, animationDelay: p.delay, animationDuration: p.duration }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
};

export default FloatingBackground;
