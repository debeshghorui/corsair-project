import { LandingPage } from "@/components/landing/LandingPage";
import { redirectAfterAuth } from "@/server/auth/postAuth";
import { getCurrentUser } from "@/server/auth/session";

export default async function Home() {
  const user = await getCurrentUser();
  if (user) await redirectAfterAuth();

  return <LandingPage />;
}
