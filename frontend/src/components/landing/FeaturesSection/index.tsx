import React from "react";
import { FaBookReader } from "react-icons/fa";
import { MdLibraryBooks } from "react-icons/md";

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="bg-white pt-16 pb-20">
      <div className="container mx-auto px-4 lg:px-16">
        <div className="flex flex-wrap gap-8">
          <div className="group flex gap-3 items-center bg-gray-50 p-6 w-fit rounded-2xl border border-darkBlue hover:bg-gray-100 transition-colors duration-500">
            <div className="flex-shrink-0">
              {/* <img className="w-12 h-12" src={logo} alt="Feature 1" /> */}
              <MdLibraryBooks className="w-8 h-8 text-darkBlue group-hover:text-mediumBlue transition-color duration-300" />
            </div>
            <div>
              {/* <h3 className="text-xl font-semibold">Feature One</h3> */}
              <p className="text-lg">Vast collection of e-books.</p>
            </div>
          </div>

          <div className="group flex gap-3 items-center bg-gray-50 p-6 w-fit rounded-2xl border border-darkBlue hover:bg-gray-100 transition-colors duration-500">
            <div className="flex-shrink-0">
              {/* <img className="w-12 h-12" src={logo} alt="Feature 2" /> */}
              <FaBookReader className="w-8 h-8 text-darkBlue group-hover:text-mediumBlue transition-color duration-300" />
            </div>
            <div>
              {/* <h3 className="text-xl font-semibold">Feature Two</h3> */}
              <p className="text-lg">Seamless reading experience.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
