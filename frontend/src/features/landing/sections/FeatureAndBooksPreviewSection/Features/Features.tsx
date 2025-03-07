import React from "react";
import { FaBookReader } from "react-icons/fa";
import { MdLibraryBooks } from "react-icons/md";
import { FaCloudDownloadAlt } from "react-icons/fa";

const Features: React.FC = () => {
  return (
    <div>
      <div className="flex flex-wrap justify-center sm:justify-start gap-8">
        <div className="group flex gap-3 items-center bg-gray-50 p-3 sm:p-6 w-fit rounded-2xl border border-darkBlue hover:bg-gray-100 transition-colors duration-500">
          <div className="flex-shrink-0">
            <MdLibraryBooks className="w-6 h-6 sm:w-8 sm:h-8 text-darkBlue group-hover:text-mediumBlue transition-color duration-300" />
          </div>
          <div>
            <p className="text-sm sm:text-lg">Vast collection of e-books.</p>
          </div>
        </div>

        <div className="group flex gap-3 items-center bg-gray-50 p-3 sm:p-6 w-fit rounded-2xl border border-darkBlue hover:bg-gray-100 transition-colors duration-500">
          <div className="flex-shrink-0">
            <FaBookReader className="w-6 h-6 sm:w-8 sm:h-8 text-darkBlue group-hover:text-mediumBlue transition-color duration-300" />
          </div>
          <div>
            <p className="text-sm sm:text-lg">Seamless reading experience.</p>
          </div>
        </div>

        <div className="group flex gap-3 items-center bg-gray-50 p-3 sm:p-6 w-fit rounded-2xl border border-darkBlue hover:bg-gray-100 transition-colors duration-500">
          <div className="flex-shrink-0">
            <FaCloudDownloadAlt className="w-6 h-6 sm:w-8 sm:h-8 text-darkBlue group-hover:text-mediumBlue transition-color duration-300" />
          </div>
          <div>
            <p className="text-sm sm:text-lg">Download for Offline Reading.</p>
          </div>
        </div>
      </div>
    </div>
    // </div>
    // </section>
  );
};

export default Features;
