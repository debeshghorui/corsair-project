import { integrationsRepo } from "@/server/repositories/integrationsRepo";
import { secretsRepo, SECRET_OPENAI_KEY } from "@/server/repositories/secretsRepo";

export type OnboardingStatus = {
  gmailConnected: boolean;
  calendarConnected: boolean;
  openaiKeySet: boolean;
  complete: boolean;
};

export const onboardingService = {
  async getStatus(tenantId: string): Promise<OnboardingStatus> {
    const [plugins, openaiKeySet] = await Promise.all([
      integrationsRepo.connectedPlugins(tenantId),
      secretsRepo.has(tenantId, SECRET_OPENAI_KEY),
    ]);

    const gmailConnected = plugins.includes("gmail");
    const calendarConnected = plugins.includes("googlecalendar");

    return {
      gmailConnected,
      calendarConnected,
      openaiKeySet,
      complete: gmailConnected && calendarConnected && openaiKeySet,
    };
  },
};
