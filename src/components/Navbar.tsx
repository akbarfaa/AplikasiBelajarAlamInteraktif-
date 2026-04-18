import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Sparkles, Brain, Trophy, Leaf } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import SoundButton from "./SoundButton";
import { playClick } from "@/utils/audio";

export const Navbar = () => {
  const { t } = useLang();
  const loc = useLocation();

  const items = [
    { to: "/", label: t("home"), icon: Home },
    { to: "/categories", label: t("categories"), icon: Sparkles },
    { to: "/quiz", label: t("quiz"), icon: Brain },
    { to: "/progress", label: t("progress"), icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="container mx-auto flex items-center justify-between gap-3 rounded-full bg-card/80 backdrop-blur-xl border-2 border-primary/15 shadow-card px-3 py-2"
      >
        <NavLink to="/" onClick={playClick} className="flex items-center gap-2 pl-2 pr-3 group">
          <span className="grid place-items-center h-10 w-10 rounded-full bg-gradient-jungle shadow-pop">
            <Leaf className="h-5 w-5 text-primary-foreground group-hover:rotate-12 transition-transform" />
          </span>
          <span className="font-display font-extrabold text-lg leading-none hidden sm:block">
            Nature<span className="text-primary">Explorer</span>
          </span>
        </NavLink>

        <div className="flex items-center gap-1">
          {items.map((it) => {
            const active = loc.pathname === it.to;
            const Icon = it.icon;
            return (
              <NavLink
                key={it.to}
                to={it.to}
                onClick={playClick}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-colors ${
                  active ? "text-primary-foreground" : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute inset-0 rounded-full bg-gradient-jungle shadow-pop"
                  />
                )}
                <Icon className="h-4 w-4 relative z-10" />
                <span className="relative z-10 hidden md:inline">{it.label}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <SoundButton />
          <LanguageSwitcher />
        </div>
      </motion.nav>
    </header>
  );
};

export default Navbar;
