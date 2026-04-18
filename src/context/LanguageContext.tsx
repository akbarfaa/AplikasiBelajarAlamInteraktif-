import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import translations from "@/data/translations.json";

export type Language = "en" | "id";
type Dict = typeof translations.en;

interface Ctx {
  lang: Language;
  setLang: (l: Language) => void;
  toggle: () => void;
  t: (key: keyof Dict) => string;
}

const LanguageContext = createContext<Ctx | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    return (localStorage.getItem("nature_lang") as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("nature_lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Language) => setLangState(l);
  const toggle = () => setLangState((p) => (p === "en" ? "id" : "en"));
  const t = (key: keyof Dict) => (translations as any)[lang][key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be inside LanguageProvider");
  return ctx;
};

export const localized = (item: { englishName: string; indonesianName: string; shortDescriptionEN: string; shortDescriptionID: string; funFactEN: string; funFactID: string }, lang: Language) => ({
  name: lang === "en" ? item.englishName : item.indonesianName,
  description: lang === "en" ? item.shortDescriptionEN : item.shortDescriptionID,
  funFact: lang === "en" ? item.funFactEN : item.funFactID,
});
