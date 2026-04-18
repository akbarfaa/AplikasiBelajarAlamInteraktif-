import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isMuted, toggleMute, playClick } from "@/utils/audio";
import { useLang } from "@/context/LanguageContext";

export const SoundButton = () => {
  const [muted, setM] = useState(isMuted());
  const { t } = useLang();

  useEffect(() => {
    const h = (e: any) => setM(e.detail);
    window.addEventListener("nature:mute", h as any);
    return () => window.removeEventListener("nature:mute", h as any);
  }, []);

  return (
    <button
      onClick={() => {
        const n = toggleMute();
        if (!n) playClick();
      }}
      aria-label={muted ? t("unmuteSound") : t("muteSound")}
      className="grid place-items-center h-11 w-11 rounded-full bg-card/80 backdrop-blur shadow-card border-2 border-primary/20 hover:scale-110 active:scale-95 transition-transform"
    >
      {muted ? <VolumeX className="h-5 w-5 text-destructive" /> : <Volume2 className="h-5 w-5 text-primary" />}
    </button>
  );
};

export default SoundButton;
