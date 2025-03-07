import { createContext, useContext, useEffect, useState } from "react";

const UIContext = createContext<any>(null);

const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [screenSize, setScreenSize] = useState("md");

  const getScreenSize = (width: number) => {
    if (width >= breakpoints["2xl"]) return "2xl";
    if (width >= breakpoints.xl) return "xl";
    if (width >= breakpoints.lg) return "lg";
    if (width >= breakpoints.md) return "md";
    if (width >= breakpoints.sm) return "sm";
    return "xs";
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setScreenSize(getScreenSize(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const contextData = {
    windowWidth,
    screenSize,
  };

  return (
    <UIContext.Provider value={contextData}>{children}</UIContext.Provider>
  );
};

const useUIContext = () => useContext(UIContext);
export default useUIContext;
