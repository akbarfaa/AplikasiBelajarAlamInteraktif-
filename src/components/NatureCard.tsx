import { motion } from "framer-motion";
import { useLang, localized } from "@/context/LanguageContext";
import { playPop, speakWord } from "@/utils/audio";

export interface NatureItem {
  id: string;
  emoji: string;
  color: string; // semantic token name
  englishName: string;
  indonesianName: string;
  sound: string;
  shortDescriptionEN: string;
  shortDescriptionID: string;
  funFactEN: string;
  funFactID: string;
}

interface Props {
  item: NatureItem;
  category: "animals" | "fruits" | "plants";
  onClick: (item: NatureItem) => void;
  index: number;
}

// Different motion personalities per category
const motionByCategory = {
  animals: { y: [0, -8, 0], rotate: [0, 5, -5, 0] },
  fruits: { y: [0, -12, 0], rotate: [0, 0, 0] },
  plants: { rotate: [-2, 2, -2], y: [0, -4, 0] },
} as const;

export const NatureCard = ({ item, category, onClick, index }: Props) => {
  const { lang } = useLang();
  const loc = localized(item, lang);
  const m = motionByCategory[category];

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 200, damping: 18 }}
      whileHover={{ y: -10, rotate: -1, scale: 1.03 }}
      whileTap={{ scale: 0.95, rotate: 2 }}
      onClick={() => {
        playPop();
        speakWord(item.englishName, item.indonesianName, lang);
        onClick(item);
      }}
      className="group relative flex flex-col items-center gap-2 rounded-3xl bg-card border-4 border-primary/10 p-5 shadow-card hover:shadow-pop hover:border-primary/40 transition-all overflow-hidden text-left"
    >
      {/* Sparkle bg */}
      <div className="absolute inset-0 bg-gradient-sky opacity-30 group-hover:opacity-60 transition-opacity" />

      <motion.div
        className="relative text-7xl sm:text-8xl drop-shadow-lg"
        animate={m as any}
        transition={{ duration: 3 + (index % 3), repeat: Infinity, ease: "easeInOut" }}
      >
        {item.emoji}
      </motion.div>

      <div className="relative text-center">
        <div className="font-display font-extrabold text-xl text-foreground leading-tight">{loc.name}</div>
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">
          {lang === "en" ? item.indonesianName : item.englishName}
        </div>
      </div>

      <div className="relative inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-sunshine text-highlight-foreground text-xs font-bold shadow-soft">
        🔊 Tap!
      </div>
    </motion.button>
  );
};

export default NatureCard;
