import Navbar from "@/components/Navbar";
import FloatingBackground from "@/components/FloatingBackground";
import ProgressContent from "@/pages/Progress";

const ProgressPage = () => (
  <main className="relative min-h-screen">
    <FloatingBackground variant="sky" />
    <Navbar />
    <ProgressContent />
  </main>
);

export default ProgressPage;
