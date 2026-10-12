import Link from "next/link";
import { Calendar, Check, Mail, Sparkles } from "lucide-react";

import { requireUser } from "@/server/auth/session";
import { onboardingService } from "@/server/services/onboardingService";
import { SignOutButton } from "@/components/auth/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OpenAiKeyForm } from "@/components/onboarding/OpenAiKeyForm";

export default async function OnboardingPage() {
  const user = await requireUser();
  const status = await onboardingService.getStatus(user.id);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-8 px-4 py-12">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
            C
          </span>
          Corsair Mail
        </div>
        <SignOutButton />
      </header>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Let&apos;s get you set up
        </h1>
        <p className="text-muted-foreground">
          Connect your accounts and add your OpenAI key. Everything is scoped to
          your tenant and stored securely.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <StepCard
          icon={<Mail className="size-5" />}
          title="Connect Gmail"
          description="Search, read, draft and send email through Corsair."
          done={status.gmailConnected}
          actionLabel="Connect Gmail"
          href="/api/integrations/connect?plugin=gmail"
        />
        <StepCard
          icon={<Calendar className="size-5" />}
          title="Connect Google Calendar"
          description="Manage your schedule and send invites."
          done={status.calendarConnected}
          actionLabel="Connect Calendar"
          href="/api/integrations/connect?plugin=googlecalendar"
        />
        <Card>
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid size-9 place-items-center rounded-lg bg-muted text-foreground">
                <Sparkles className="size-5" />
              </span>
              <div className="flex flex-col gap-1">
                <CardTitle className="text-base">Add your OpenAI key</CardTitle>
                <CardDescription>
                  Powers priority filtering, semantic search and agent chat.
                </CardDescription>
              </div>
            </div>
            <StatusBadge done={status.openaiKeySet} />
          </CardHeader>
          <CardContent>
            <OpenAiKeyForm alreadySet={status.openaiKeySet} />
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between border-t pt-6">
        <p className="text-sm text-muted-foreground">
          {status.complete
            ? "You're all set."
            : "Complete all three steps to continue."}
        </p>
        <Button asChild disabled={!status.complete}>
          <Link href={status.complete ? "/mail" : "/onboarding"} aria-disabled={!status.complete}>
            Enter Corsair Mail
          </Link>
        </Button>
      </div>
    </div>
  );
}

function StepCard({
  icon,
  title,
  description,
  done,
  actionLabel,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  done: boolean;
  actionLabel: string;
  href: string;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid size-9 place-items-center rounded-lg bg-muted text-foreground">
            {icon}
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
        {done ? (
          <StatusBadge done />
        ) : (
          <Button asChild size="sm">
            <a href={href}>{actionLabel}</a>
          </Button>
        )}
      </CardHeader>
    </Card>
  );
}

function StatusBadge({ done }: { done: boolean }) {
  return done ? (
    <Badge variant="success" className="gap-1">
      <Check className="size-3" /> Connected
    </Badge>
  ) : (
    <Badge variant="warning">Pending</Badge>
  );
}
