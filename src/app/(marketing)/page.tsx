import { auth } from "@clerk/nextjs/server";

import { LandingPage } from "@/components/landing/LandingPage";
import { redirectAfterAuth } from "@/server/auth/postAuth";

export default async function Home() {
  const { userId } = await auth();
  if (userId) await redirectAfterAuth();

  return <LandingPage />;
}
