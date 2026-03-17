
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import CoreResponsibilitiesSection from "@/components/home/CoreResponsibilitiesSection";
import ExamResultsSection from "@/components/home/ExamResultsSection";
import NoticeBoardSection from "@/components/home/NoticeBoardSection";
import StatsSection from "@/components/home/StatsSection";

export default function HomePage() {
  return (
    <>
      
      {/* Fix 2 — Exactly one <main> per page, lives here not in layout.tsx */}
      <main>
        <HeroSection />
        <AboutSection />
        <CoreResponsibilitiesSection />
        <ExamResultsSection />
        <NoticeBoardSection />
        <StatsSection />
      </main>
    </>
  );
}