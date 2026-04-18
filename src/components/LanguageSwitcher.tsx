import { motion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import { playClick } from "@/utils/audio";

export const LanguageSwitcher = () => {
  const { lang, setLang } = useLang();
  const handle = (l: "en" | "id") => {
    if (l !== lang) {
      playClick();
      setLang(l);
    }
  };
  return (
    <div className="relative inline-flex rounded-full bg-card/80 backdrop-blur p-1 shadow-card border-2 border-primary/20">
      {(["en", "id"] as const).map((l) => (
        <button
          key={l}
          onClick={() => handle(l)}
          className={`relative z-10 px-4 py-1.5 text-sm font-bold uppercase rounded-full transition-colors ${
            lang === l ? "text-primary-foreground" : "text-foreground/70 hover:text-foreground"
          }`}
        >
          {l}
        </button>
      ))}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-gradient-jungle shadow-pop"
        style={{ left: lang === "en" ? 4 : "calc(50% + 0px)" }}
      />
    </div>
  );
};

export default LanguageSwitcher;
