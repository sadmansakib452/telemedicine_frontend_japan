import LandingNavbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import LandingFooter from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900">
      <LandingNavbar />
      <main className="flex flex-col">
        <HeroSection />
        <AboutSection />
      </main>
      <LandingFooter />
    </div>
  );
}

