import React from "react";
import HeroSection from "../sections/HeroSection/HeroSection";
import FeatureAndBooksPreviewSection from "../sections/FeatureAndBooksPreviewSection/FeatureAndBooksPreviewSection";

const LandingPage: React.FC = () => {
  return (
    <div className="bg-white">
      <HeroSection />
      <FeatureAndBooksPreviewSection />
    </div>
  );
};

export default LandingPage;
