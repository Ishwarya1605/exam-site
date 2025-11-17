import "./globals.scss"; 
import LandingHeader from "@/components/LandingHeader";
import LandingHero from "@/components/LandingHero";
import LandingCourses from "@/components/LandingCourses";
import LandingOffer from "@/components/LandingOffer";
import LandingFeatures from "@/components/LandingFeatures";
import LandingFooter from "@/components/LandingFooter";

export default function Home() {
  return (
    <>
      <LandingHeader />
      <LandingHero />
      <LandingOffer />
      <LandingCourses />
      <LandingFeatures />
      <LandingFooter />
    </>
  );
}

