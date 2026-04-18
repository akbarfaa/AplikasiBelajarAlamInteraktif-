import { motion } from "framer-motion";
import mascot from "@/assets/mascot-owl.png";

interface Props { message?: string }

export const MascotGuide = ({ message }: Props) => (
  <div className="fixed bottom-4 left-4 z-40 flex items-end gap-2 pointer-events-none">
    <motion.img
      src={mascot}
      alt="Owl mascot"
      className="h-24 w-24 sm:h-32 sm:w-32 drop-shadow-2xl"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: [0, -10, 0], opacity: 1 }}
      transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 0.6 } }}
    />
    {message && (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: -10 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        className="mb-4 max-w-[200px] rounded-2xl rounded-bl-sm bg-card border-2 border-primary/20 px-3 py-2 text-xs sm:text-sm font-semibold shadow-card"
      >
        {message}
      </motion.div>
    )}
  </div>
);

export default MascotGuide;
