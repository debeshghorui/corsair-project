import { auth } from "@clerk/nextjs/server";

import { redirectAfterAuth } from "@/server/auth/postAuth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (userId) await redirectAfterAuth();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-muted/30 px-4">
      <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
        <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
          C
        </span>
        Corsair Mail
      </div>
      {children}
    </div>
  );
}
