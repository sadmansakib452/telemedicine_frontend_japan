import LandingNavbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import LandingFooter from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-brand-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800/50">
      <LandingNavbar />
      <main className="flex flex-col">
        <HeroSection />
        <AboutSection />
      </main>
      <LandingFooter />
    </div>
  );
}

