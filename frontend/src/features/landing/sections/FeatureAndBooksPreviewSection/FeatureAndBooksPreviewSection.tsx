import React, { useEffect, useState } from "react";
import Features from "./Features/Features";
import BooksPreview from "./BooksPreview/BooksPreview";

const FeatureAndBooksPreviewSection: React.FC = () => {
  return (
    <section id="second-section" className="bg-white pt-16 pb-20">
      <div className="container mx-auto px-4 lg:px-16">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div className="flex-[4]">
            <Features />
          </div>
          <div className="flex-[6]">
            <BooksPreview />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureAndBooksPreviewSection;
