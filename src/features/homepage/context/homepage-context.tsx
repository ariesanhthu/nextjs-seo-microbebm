"use client";

import React, { createContext, useContext, useMemo } from "react";
import { HomepageResponseDto } from "@/lib/dto/homepage.dto";

type HomepageContextValue = HomepageResponseDto | null;

const HomepageContext = createContext<HomepageContextValue>(null);

type HomepageProviderProps = {
  value: HomepageResponseDto;
  children: React.ReactNode;
};

export function HomepageProvider({ value, children }: HomepageProviderProps) {
  const memoValue = useMemo(() => value, [value]);
  return (
    <HomepageContext.Provider value={memoValue}>
      {children}
    </HomepageContext.Provider>
  );
}

export function useHomepage(): HomepageResponseDto {
  const ctx = useContext(HomepageContext);
  if (!ctx) {
    throw new Error("useHomepage must be used within HomepageProvider");
  }
  return ctx;
}


