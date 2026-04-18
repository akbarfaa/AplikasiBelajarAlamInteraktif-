import { AnimatePresence, motion } from "framer-motion";
import { X, Volume2 } from "lucide-react";
import { useEffect } from "react";
import { useLang, localized } from "@/context/LanguageContext";
import { playClick, playSound } from "@/utils/audio";
import { markVisited } from "@/utils/storage";
import type { NatureItem } from "./NatureCard";

interface Props {
  item: NatureItem | null;
  category: "animals" | "fruits" | "plants";
  onClose: () => void;
}

const heroAnimByCategory = {
  animals: { y: [0, -20, 0], rotate: [-5, 5, -5] },
  fruits: { y: [-200, 0, 0], rotate: [0, 360, 380] },
  plants: { scaleY: [0.4, 1.05, 1], rotate: [-3, 3, -3] },
} as const;

export const DetailModal = ({ item, category, onClose }: Props) => {
  const { lang, t } = useLang();

  useEffect(() => {
    if (item) markVisited(item.id);
  }, [item]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] grid place-items-center p-4 bg-foreground/40 backdrop-blur-sm"
          onClick={() => { playClick(); onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-[2rem] bg-card border-4 border-primary/20 shadow-pop overflow-hidden"
          >
            {/* Confetti dots header */}
            <div className="relative h-48 bg-gradient-magic overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute h-2 w-2 rounded-full bg-card/70"
                  style={{ left: `${(i * 53) % 100}%`, top: `${(i * 37) % 100}%` }}
                  animate={{ y: [0, 15, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
              <motion.div
                key={item.id + lang}
                className="absolute inset-0 grid place-items-center text-9xl drop-shadow-2xl"
                animate={heroAnimByCategory[category] as any}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                {item.emoji}
              </motion.div>

              <button
                onClick={() => { playClick(); onClose(); }}
                aria-label={t("close")}
                className="absolute top-3 right-3 grid place-items-center h-10 w-10 rounded-full bg-card/90 hover:bg-card shadow-card transition-transform hover:scale-110 active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h2 className="font-display font-extrabold text-3xl text-foreground">
                  {lang === "en" ? item.englishName : item.indonesianName}
                </h2>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  {lang === "en" ? item.indonesianName : item.englishName}
                </p>
              </div>

              <div className="rounded-2xl bg-secondary/15 border-2 border-secondary/30 p-4">
                <div className="text-xs font-bold uppercase text-secondary mb-1">{t("description")}</div>
                <p className="text-foreground font-medium">{localized(item, lang).description}</p>
              </div>

              <div className="rounded-2xl bg-accent/20 border-2 border-accent/40 p-4">
                <div className="text-xs font-bold uppercase text-highlight mb-1">✨ {t("funFact")}</div>
                <p className="text-foreground font-medium">{localized(item, lang).funFact}</p>
              </div>

              <button
                onClick={() => playSound(item.sound)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-jungle text-primary-foreground font-bold py-3 shadow-pop hover:scale-[1.02] active:scale-95 transition-transform"
              >
                <Volume2 className="h-5 w-5" /> {t("playSound")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DetailModal;
