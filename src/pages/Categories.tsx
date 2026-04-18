import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import { playClick, playPop } from "@/utils/audio";
import animals from "@/assets/portal-animals.jpg";
import fruits from "@/assets/portal-fruits.jpg";
import plants from "@/assets/portal-plants.jpg";
import { ArrowRight } from "lucide-react";

export default function Categories() {
  const { t } = useLang();
  const cats = [
    { key: "animals", title: t("animalsWorld"), desc: t("animalsDesc"), img: animals, gradient: "bg-gradient-jungle", emoji: "🦁🐯🐘" },
    { key: "fruits", title: t("fruitsWorld"), desc: t("fruitsDesc"), img: fruits, gradient: "bg-gradient-fruits", emoji: "🍎🍌🥭" },
    { key: "plants", title: t("plantsWorld"), desc: t("plantsDesc"), img: plants, gradient: "bg-gradient-plants", emoji: "🌹🌻🌵" },
  ];

  return (
    <section className="container mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10 space-y-2"
      >
        <h1 className="font-display font-extrabold text-4xl md:text-5xl">
          ✨ {t("categories")} ✨
        </h1>
        <p className="text-foreground/70 font-medium">{t("tapToLearn")}</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {cats.map((c, i) => (
          <motion.div
            key={c.key}
            initial={{ opacity: 0, y: 60, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.15, type: "spring", stiffness: 220, damping: 20 }}
            whileHover={{ y: -10, scale: 1.02 }}
          >
            <Link
              to={`/explore/${c.key}`}
              onClick={() => { playClick(); playPop(); }}
              className="group relative block overflow-hidden rounded-[2rem] border-4 border-card shadow-card hover:shadow-pop transition-shadow"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img src={c.img} alt={c.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" width={1024} height={1024} />
                <div className={`absolute inset-0 mix-blend-multiply opacity-30 ${c.gradient}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

                {/* Floating emojis */}
                {[...c.emoji].map((e, j) => (
                  <motion.span
                    key={j}
                    className="absolute text-3xl drop-shadow-lg"
                    style={{ top: `${15 + j * 15}%`, left: `${10 + j * 25}%` }}
                    animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2.5 + j, repeat: Infinity, ease: "easeInOut", delay: j * 0.2 }}
                  >
                    {e}
                  </motion.span>
                ))}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 text-card">
                <h2 className="font-display font-extrabold text-2xl text-card mb-1 drop-shadow-lg" style={{ color: 'hsl(var(--card))' }}>
                  {c.title}
                </h2>
                <p className="text-sm font-medium text-card/90 mb-3 drop-shadow" style={{ color: 'hsl(var(--card))', opacity: 0.95 }}>{c.desc}</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-card text-foreground px-4 py-1.5 text-sm font-extrabold shadow-pop group-hover:bg-accent transition-colors">
                  {t("enter")} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
