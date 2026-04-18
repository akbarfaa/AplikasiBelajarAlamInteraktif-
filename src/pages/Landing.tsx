import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Sparkles, ArrowRight } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import heroWorld from "@/assets/hero-world.jpg";
import { playClick, playSuccess } from "@/utils/audio";

export default function Landing() {
  const { t } = useLang();
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;
    const chars = titleRef.current.querySelectorAll("span[data-char]");
    gsap.fromTo(
      chars,
      { y: 60, opacity: 0, rotate: -20 },
      { y: 0, opacity: 1, rotate: 0, stagger: 0.04, duration: 0.8, ease: "back.out(2)" }
    );
  }, [t]);

  const title = t("welcome");

  return (
    <section className="relative min-h-[calc(100vh-100px)] container mx-auto px-4 py-8 md:py-12 grid lg:grid-cols-2 gap-10 items-center">
      <div className="relative z-10 space-y-6">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="inline-flex items-center gap-2 rounded-full bg-card/90 backdrop-blur px-4 py-2 shadow-card border-2 border-accent/40"
        >
          <Sparkles className="h-4 w-4 text-highlight animate-wiggle" />
          <span className="text-sm font-bold">{t("tagline")}</span>
        </motion.div>

        <h1
          ref={titleRef}
          className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight text-foreground"
        >
          {title.split("").map((c, i) => (
            <span key={i} data-char className="inline-block" style={{ whiteSpace: c === " " ? "pre" : undefined }}>
              {c}
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-lg text-foreground/70 font-medium max-w-xl"
        >
          {t("welcomeSub")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap items-center gap-4"
        >
          <Link
            to="/categories"
            onClick={() => { playClick(); playSuccess(); }}
            className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-jungle text-primary-foreground px-7 py-4 font-display font-extrabold text-lg shadow-pop hover:scale-105 active:scale-95 transition-transform animate-glow-pulse"
          >
            {t("startExploring")}
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/quiz"
            onClick={playClick}
            className="inline-flex items-center gap-2 rounded-full bg-card border-2 border-primary/30 px-6 py-4 font-bold hover:bg-primary/5 transition-colors"
          >
            🧠 {t("quiz")}
          </Link>
        </motion.div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 pt-4">
          {[
            { e: "🦁", l: t("animals") },
            { e: "🍎", l: t("fruits") },
            { e: "🌻", l: t("plants") },
          ].map((it, i) => (
            <motion.div
              key={it.l}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.15, type: "spring", stiffness: 300 }}
              className="inline-flex items-center gap-2 rounded-full bg-card/80 backdrop-blur px-4 py-2 shadow-card border-2 border-primary/15"
            >
              <span className="text-2xl">{it.e}</span>
              <span className="font-bold">{it.l}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hero image with floating bubbles */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden border-8 border-card shadow-pop">
          <img
            src={heroWorld}
            alt="Magical nature world with jungle, orchard and garden"
            className="w-full h-full object-cover"
            width={1920}
            height={1024}
          />
          {/* Floating animal bubbles */}
          {[
            { e: "🦁", x: "5%", y: "10%" },
            { e: "🦋", x: "70%", y: "20%" },
            { e: "🍎", x: "85%", y: "55%" },
            { e: "🌻", x: "10%", y: "70%" },
          ].map((b, i) => (
            <motion.div
              key={i}
              className="absolute grid place-items-center h-16 w-16 rounded-full bg-card shadow-pop text-3xl"
              style={{ left: b.x, top: b.y }}
              animate={{ y: [0, -12, 0], rotate: [0, 8, -8, 0] }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            >
              {b.e}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
