const KEY = "nature_progress_v1";

export interface Progress {
  visited: string[]; // item ids
  bestScore: number;
  totalQuestions: number;
}

const empty: Progress = { visited: [], bestScore: 0, totalQuestions: 0 };

export const getProgress = (): Progress => {
  if (typeof window === "undefined") return empty;
  try {
    return JSON.parse(localStorage.getItem(KEY) || "") || empty;
  } catch {
    return empty;
  }
};

export const saveProgress = (p: Progress) => {
  localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new CustomEvent("nature:progress"));
};

export const markVisited = (id: string) => {
  const p = getProgress();
  if (!p.visited.includes(id)) {
    p.visited.push(id);
    saveProgress(p);
  }
};

export const recordScore = (score: number, total: number) => {
  const p = getProgress();
  if (score > p.bestScore) p.bestScore = score;
  p.totalQuestions = Math.max(p.totalQuestions, total);
  saveProgress(p);
};

export const resetProgress = () => saveProgress(empty);
