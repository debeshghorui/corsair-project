import { redirect } from "next/navigation";

import { requireUser } from "@/server/auth/session";
import { onboardingService } from "@/server/services/onboardingService";
import { AppShell } from "@/components/app/AppShell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const status = await onboardingService.getStatus(user.id);
  if (!status.complete) redirect("/onboarding");

  return (
    <AppShell user={{ email: user.email, name: user.name }}>{children}</AppShell>
  );
}
