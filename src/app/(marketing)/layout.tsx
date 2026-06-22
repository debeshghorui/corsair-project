import type { Metadata } from "next";

import "@/components/landing/landing-tokens.css";

export const metadata: Metadata = {
  title: "Mainframe® — Creative Studio & Labs",
  description:
    "Meet A.R.I.A, Mainframe's Adaptive Response Interface Agent. Good taste tends to find us — now, what are we building?",
  openGraph: {
    title: "Mainframe® — Creative Studio & Labs",
    description:
      "Meet A.R.I.A, Mainframe's Adaptive Response Interface Agent.",
    type: "website",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="landing">{children}</div>;
}
