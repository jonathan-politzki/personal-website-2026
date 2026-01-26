"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ThemeContextType {
  credoIsDark: boolean;
  setCredoIsDark: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [credoIsDark, setCredoIsDark] = useState(true);

  return (
    <ThemeContext.Provider value={{ credoIsDark, setCredoIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
