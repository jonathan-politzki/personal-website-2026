"use client";

import { ThemeProvider } from "@/context/theme-context";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
