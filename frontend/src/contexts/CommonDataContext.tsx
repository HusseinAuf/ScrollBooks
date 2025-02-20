import { createContext, useContext, useEffect, useState } from "react";
import { categoryService } from "../services/api/categories";
import { useQuery } from "@tanstack/react-query";

const CommonDataContext = createContext<any>(null);

export const CommonDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
    select: (data: any) => data?.data || [],
  });

  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "es", name: "Spanish" },
    { code: "ar", name: "Arabic" },
  ];

  const currenciesMap = {
    USD: "$",
    EUR: "€",
    GBP: "£",
  };

  const contextData = {
    categories: categories || [],
    languages,
    currenciesMap,
  };

  return (
    <CommonDataContext.Provider value={contextData}>
      {children}
    </CommonDataContext.Provider>
  );
};

const useCommonDataContext = () => useContext(CommonDataContext);
export default useCommonDataContext;
