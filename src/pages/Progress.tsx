import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Star, BookOpen, RotateCcw } from "lucide-react";
import { useLang, localized } from "@/context/LanguageContext";
import { getProgress, resetProgress, type Progress } from "@/utils/storage";
import { playClick } from "@/utils/audio";
import animals from "@/data/animals.json";
import fruits from "@/data/fruits.json";
import plants from "@/data/plants.json";
import type { NatureItem } from "@/components/NatureCard";

const allItems: NatureItem[] = [
  ...(animals as NatureItem[]),
  ...(fruits as NatureItem[]),
  ...(plants as NatureItem[]),
];

export default function ProgressPage() {
  const { t, lang } = useLang();
  const [p, setP] = useState<Progress>(getProgress());

  useEffect(() => {
    const refresh = () => setP(getProgress());
    window.addEventListener("nature:progress", refresh);
    return () => window.removeEventListener("nature:progress", refresh);
  }, []);

  const total = allItems.length;
  const learned = p.visited.length;
  const pct = Math.round((learned / total) * 100);

  return (
    <section className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="text-center mb-8">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="inline-grid place-items-center h-20 w-20 rounded-full bg-gradient-sunshine shadow-pop mb-3">
          <Trophy className="h-10 w-10 text-highlight-foreground" />
        </motion.div>
        <h1 className="font-display font-extrabold text-4xl">{t("yourProgress")}</h1>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: BookOpen, label: t("learnedItems"), value: `${learned}/${total}`, gradient: "bg-gradient-jungle" },
          { icon: Star, label: t("bestScore"), value: `${p.bestScore}/${Math.max(p.totalQuestions, 8)}`, gradient: "bg-gradient-sunshine" },
          { icon: Trophy, label: t("completion"), value: `${pct}%`, gradient: "bg-gradient-plants" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-3xl bg-card border-4 border-primary/15 p-6 shadow-card"
          >
            <div className={`inline-grid place-items-center h-12 w-12 rounded-2xl ${s.gradient} shadow-soft mb-3`}>
              <s.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="text-3xl font-display font-extrabold">{s.value}</div>
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Big progress bar */}
      <div className="rounded-3xl bg-card border-4 border-primary/15 p-6 shadow-card mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold">{t("completion")}</span>
          <span className="font-extrabold text-primary">{pct}%</span>
        </div>
        <div className="h-5 rounded-full bg-muted overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, type: "spring" }} className="h-full bg-gradient-magic" />
        </div>
      </div>

      {/* Visited grid */}
      {learned === 0 ? (
        <div className="rounded-3xl bg-card border-4 border-dashed border-primary/30 p-10 text-center">
          <div className="text-5xl mb-2">🌱</div>
          <p className="font-bold text-foreground/70">{t("noProgress")}</p>
        </div>
      ) : (
        <div>
          <h2 className="font-display font-extrabold text-2xl mb-4">✨ {t("completed")}</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3">
            {allItems
              .filter((it) => p.visited.includes(it.id))
              .map((it) => (
                <motion.div
                  key={it.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex flex-col items-center gap-1 rounded-2xl bg-card border-2 border-success/40 p-3 shadow-card"
                >
                  <div className="text-4xl">{it.emoji}</div>
                  <div className="text-xs font-bold text-center">{localized(it, lang).name}</div>
                </motion.div>
              ))}
          </div>
        </div>
      )}

      <div className="text-center mt-10">
        <button
          onClick={() => { playClick(); resetProgress(); }}
          className="inline-flex items-center gap-2 rounded-full bg-card border-2 border-destructive/30 text-destructive px-5 py-2 font-bold hover:bg-destructive/10 transition-colors"
        >
          <RotateCcw className="h-4 w-4" /> {t("resetProgress")}
        </button>
      </div>
    </section>
  );
}
