"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

export function ThemeProvider({
  children,
  scriptProps,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      {...props}
      scriptProps={{
        ...scriptProps,
        // React 19 will not execute a <script> rendered by a client component,
        // and it logs an error when one is created. A non-JS type is treated
        // as a data block. The blocking script lives in the root layout.
        type: "application/json",
      }}
    >
      {children}
    </NextThemesProvider>
  );
}
