import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FloatingBackground from "@/components/FloatingBackground";
import Explore from "@/pages/Explore";

const ExplorePage = () => {
  const { category } = useParams<{ category: "animals" | "fruits" | "plants" }>();
  const variant = (category as any) || "sky";
  return (
    <main className="relative min-h-screen">
      <FloatingBackground variant={variant === "sky" ? "sky" : variant} />
      <Navbar />
      <Explore />
    </main>
  );
};

export default ExplorePage;
