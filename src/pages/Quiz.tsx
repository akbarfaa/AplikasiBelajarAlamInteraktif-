import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useLang, localized } from "@/context/LanguageContext";
import animals from "@/data/animals.json";
import fruits from "@/data/fruits.json";
import plants from "@/data/plants.json";
import type { NatureItem } from "@/components/NatureCard";
import { playClick, playSuccess, playWrong, playSound } from "@/utils/audio";
import { recordScore } from "@/utils/storage";
import { CheckCircle2, XCircle, Trophy, RotateCcw } from "lucide-react";

interface Q {
  prompt: string;
  promptEN: string;
  promptID: string;
  correct: NatureItem;
  options: NatureItem[];
  category: "animals" | "fruits" | "plants";
}

const all = { animals: animals as NatureItem[], fruits: fruits as NatureItem[], plants: plants as NatureItem[] };

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const buildQuestions = (count = 8): Q[] => {
  const cats: ("animals" | "fruits" | "plants")[] = ["animals", "fruits", "plants"];
  const qs: Q[] = [];
  for (let i = 0; i < count; i++) {
    const cat = cats[i % cats.length];
    const pool = shuffle(all[cat]);
    const correct = pool[0];
    const distractors = pool.slice(1, 4);
    qs.push({
      prompt: "",
      promptEN: `Which one is "${correct.englishName}"?`,
      promptID: `Manakah yang merupakan "${correct.indonesianName}"?`,
      correct,
      options: shuffle([correct, ...distractors]),
      category: cat,
    });
  }
  return qs;
};

export default function Quiz() {
  const { t, lang } = useLang();
  const [questions, setQuestions] = useState<Q[]>(() => buildQuestions(8));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  const current = questions[idx];

  const fire = () => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ["#22c55e", "#3b82f6", "#f59e0b", "#ec4899"] });
  };

  useEffect(() => {
    if (done) {
      recordScore(score, questions.length);
      if (score / questions.length >= 0.6) fire();
    }
  }, [done]);

  const handlePick = (id: string) => {
    if (picked) return;
    setPicked(id);
    if (id === current.correct.id) {
      setScore((s) => s + 1);
      playSuccess();
      fire();
    } else {
      playWrong();
    }
  };

  const next = () => {
    playClick();
    setPicked(null);
    if (idx + 1 >= questions.length) setDone(true);
    else setIdx(idx + 1);
  };

  const restart = () => {
    playClick();
    setQuestions(buildQuestions(8));
    setIdx(0);
    setScore(0);
    setPicked(null);
    setDone(false);
    setStarted(true);
  };

  if (!started) {
    return (
      <section className="container mx-auto px-4 py-16 text-center max-w-xl">
        <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200 }} className="text-8xl mb-4">🧠</motion.div>
        <h1 className="font-display font-extrabold text-4xl mb-2">{t("quizTitle")}</h1>
        <p className="text-foreground/70 mb-8 font-medium">{t("quizSub")}</p>
        <button
          onClick={() => { playClick(); setStarted(true); }}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-jungle text-primary-foreground px-8 py-4 font-display font-extrabold text-lg shadow-pop hover:scale-105 active:scale-95 transition-transform animate-glow-pulse"
        >
          ✨ {t("startQuiz")}
        </button>
      </section>
    );
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <section className="container mx-auto px-4 py-12 text-center max-w-lg">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, 10, -10, 0] }} transition={{ type: "spring", stiffness: 200 }} className="mx-auto grid place-items-center h-32 w-32 rounded-full bg-gradient-sunshine shadow-pop mb-6">
          <Trophy className="h-16 w-16 text-highlight-foreground" />
        </motion.div>
        <h2 className="font-display font-extrabold text-4xl mb-2">{t("quizDone")}</h2>
        <p className="text-foreground/70 mb-6 font-medium">{t("yourScore")}</p>
        <div className="rounded-3xl bg-card border-4 border-primary/15 p-8 shadow-card mb-6">
          <div className="text-6xl font-display font-extrabold text-primary">{score}<span className="text-foreground/40">/{questions.length}</span></div>
          <div className="text-sm font-bold text-muted-foreground mt-1">{pct}% ✨</div>
        </div>
        <button onClick={restart} className="inline-flex items-center gap-2 rounded-full bg-gradient-jungle text-primary-foreground px-7 py-3 font-extrabold shadow-pop hover:scale-105 transition-transform">
          <RotateCcw className="h-5 w-5" /> {t("playAgain")}
        </button>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          {t("question")} {idx + 1} {t("of")} {questions.length}
        </div>
        <div className="rounded-full bg-card border-2 border-accent/40 px-4 py-1.5 font-bold shadow-card">
          ⭐ {t("score")}: {score}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-3 rounded-full bg-muted overflow-hidden mb-8">
        <motion.div className="h-full bg-gradient-jungle" initial={{ width: 0 }} animate={{ width: `${((idx) / questions.length) * 100}%` }} transition={{ type: "spring" }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="rounded-3xl bg-card border-4 border-primary/15 p-6 shadow-card"
        >
          <div className="text-center mb-6">
            <button
              onClick={() => playSound(current.correct.sound)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-sunshine px-4 py-2 font-bold text-highlight-foreground shadow-soft mb-3 hover:scale-105 transition-transform"
            >
              🔊 Listen
            </button>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl">
              {lang === "en" ? current.promptEN : current.promptID}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {current.options.map((opt) => {
              const isCorrect = opt.id === current.correct.id;
              const isPicked = picked === opt.id;
              const showState = picked != null;
              return (
                <motion.button
                  key={opt.id}
                  whileHover={{ scale: picked ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePick(opt.id)}
                  disabled={!!picked}
                  className={`relative flex flex-col items-center gap-1 rounded-2xl border-4 p-4 transition-all ${
                    showState
                      ? isCorrect
                        ? "bg-success/15 border-success"
                        : isPicked
                          ? "bg-destructive/15 border-destructive"
                          : "bg-card border-border opacity-60"
                      : "bg-card border-primary/20 hover:border-primary"
                  }`}
                >
                  <span className="text-5xl">{opt.emoji}</span>
                  <span className="text-sm font-bold">{localized(opt, lang).name}</span>
                  {showState && isCorrect && <CheckCircle2 className="absolute top-1 right-1 h-5 w-5 text-success" />}
                  {showState && isPicked && !isCorrect && <XCircle className="absolute top-1 right-1 h-5 w-5 text-destructive" />}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {picked && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                <div className={`inline-block rounded-full px-5 py-2 font-bold mb-4 ${picked === current.correct.id ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}`}>
                  {picked === current.correct.id ? `🎉 ${t("correct")}` : `💪 ${t("wrong")}`}
                </div>
                <div>
                  <button onClick={next} className="inline-flex items-center gap-2 rounded-full bg-gradient-jungle text-primary-foreground px-6 py-3 font-extrabold shadow-pop hover:scale-105 transition-transform">
                    {idx + 1 >= questions.length ? t("finish") : t("nextQuestion")} →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
