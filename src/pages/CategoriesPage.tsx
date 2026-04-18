import Navbar from "@/components/Navbar";
import FloatingBackground from "@/components/FloatingBackground";
import MascotGuide from "@/components/MascotGuide";
import Categories from "@/pages/Categories";

const CategoriesPage = () => (
  <main className="relative min-h-screen">
    <FloatingBackground variant="sky" />
    <Navbar />
    <Categories />
    <MascotGuide />
  </main>
);

export default CategoriesPage;
