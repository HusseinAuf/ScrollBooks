import React from "react";

const LoadingPage: React.FC = () => {
  return (
    <div className="h-screen p-4 flex flex-col gap-y-4 items-center justify-center bg-gradient-to-r from-darkBlue to-mediumBlue text-white">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-xLightBlue border-t-transparent border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-xl">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingPage;
