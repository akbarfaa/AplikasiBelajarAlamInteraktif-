import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import FloatingBackground from "@/components/FloatingBackground";
import MascotGuide from "@/components/MascotGuide";
import Landing from "@/pages/Landing";
import { useLang } from "@/context/LanguageContext";

const Index = () => {
  const { t } = useLang();
  return (
    <main className="relative min-h-screen">
      <FloatingBackground variant="sky" />
      <Navbar />
      <Suspense fallback={null}>
        <Landing />
      </Suspense>
      <MascotGuide message={t("tapToLearn")} />
    </main>
  );
};

export default Index;
