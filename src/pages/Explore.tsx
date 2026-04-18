import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import animalsData from "@/data/animals.json";
import fruitsData from "@/data/fruits.json";
import plantsData from "@/data/plants.json";
import NatureCard, { NatureItem } from "@/components/NatureCard";
import DetailModal from "@/components/DetailModal";
import { playClick } from "@/utils/audio";

const dataMap = {
  animals: animalsData as NatureItem[],
  fruits: fruitsData as NatureItem[],
  plants: plantsData as NatureItem[],
};

export default function Explore() {
  const { category } = useParams<{ category: keyof typeof dataMap }>();
  const navigate = useNavigate();
  const { t } = useLang();
  const [selected, setSelected] = useState<NatureItem | null>(null);

  const cat = (category && dataMap[category] ? category : "animals") as keyof typeof dataMap;
  const items = useMemo(() => dataMap[cat], [cat]);

  const titleKey = (`${cat}World` as const);
  const gradientByCat = {
    animals: "bg-gradient-jungle",
    fruits: "bg-gradient-fruits",
    plants: "bg-gradient-plants",
  } as const;

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => { playClick(); navigate("/categories"); }}
          className="inline-flex items-center gap-2 rounded-full bg-card border-2 border-primary/20 px-4 py-2 font-bold hover:bg-primary/5 transition-colors shadow-card"
        >
          <ArrowLeft className="h-4 w-4" /> {t("back")}
        </button>
        <motion.h1
          key={cat}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`font-display font-extrabold text-2xl sm:text-4xl text-primary-foreground rounded-full px-6 py-2 shadow-pop ${gradientByCat[cat]}`}
        >
          {t(titleKey as any)}
        </motion.h1>
        <div className="w-[80px]" />
      </div>

      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
      >
        {items.map((item, idx) => (
          <NatureCard key={item.id} item={item} category={cat} index={idx} onClick={setSelected} />
        ))}
      </motion.div>

      <DetailModal item={selected} category={cat} onClose={() => setSelected(null)} />
    </section>
  );
}
