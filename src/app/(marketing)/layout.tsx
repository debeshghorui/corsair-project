import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/components/landing/landing-tokens.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-landing",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Corsair Mail — Fast Gmail & Calendar",
  description:
    "A faster Gmail + Google Calendar workflow, powered by Corsair. Keyboard-first inbox, AI priority triage, and instant local search.",
  openGraph: {
    title: "Corsair Mail — Fast Gmail & Calendar",
    description:
      "A faster Gmail + Google Calendar workflow, powered by Corsair.",
    type: "website",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={`landing ${inter.className}`}>{children}</div>;
}
