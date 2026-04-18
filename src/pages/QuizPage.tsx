import Navbar from "@/components/Navbar";
import FloatingBackground from "@/components/FloatingBackground";
import Quiz from "@/pages/Quiz";

const QuizPage = () => (
  <main className="relative min-h-screen">
    <FloatingBackground variant="sky" />
    <Navbar />
    <Quiz />
  </main>
);

export default QuizPage;
