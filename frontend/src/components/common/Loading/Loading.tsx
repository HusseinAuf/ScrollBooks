import React from "react";

interface LadingProps {
  className?: string;
}

const Loading: React.FC<LadingProps> = ({ className = "" }) => {
  const baseClassName =
    "w-16 h-16 self-center border-4 border-darkBlue border-t-transparent border-solid rounded-full animate-spin z-10";
  return <div className={baseClassName + " " + className}></div>;
};

export default Loading;
