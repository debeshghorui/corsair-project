import { auth } from "@clerk/nextjs/server";

export default function AppLoading() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
        <div className="size-8 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground" />
        Loading…
      </div>
    </div>
  );
}
