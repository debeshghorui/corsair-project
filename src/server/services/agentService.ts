import {
  Agent,
  run,
  tool,
  setTracingDisabled,
  OpenAIChatCompletionsModel,
} from "@openai/agents";
import { OpenAIAgentsProvider } from "@corsair-dev/mcp";

import { aiService, AI_MODELS } from "@/server/services/aiService";
import { tenantClientFor } from "@/server/tenant";

// We bring our own OpenAI client per tenant; disable the SDK's global tracing
// exporter (which would otherwise look for a global API key).
setTracingDisabled(true);

function instructions(): string {
  const now = new Date();
  return [
    "You are Corsair Assistant, an email + calendar agent acting on behalf of the signed-in user.",
    `The current date and time is ${now.toString()} (ISO: ${now.toISOString()}).`,
    "You have Corsair tools to operate the user's Gmail and Google Calendar:",
    "- Use `list_operations` to discover available endpoints (plugins: 'gmail', 'googlecalendar').",
    "- Use `get_schema` to inspect an operation's inputs before calling it.",
    "- Use `run_script` to execute the operation: write JS using the `corsair` object in scope, e.g. `return await corsair.gmail.api.messages.send({ raw });` or `return await corsair.googlecalendar.api.events.create({ event: {...}, sendUpdates: 'all' });`.",
    "To send email you must build a base64url-encoded RFC822 message for the `raw` field (headers To/Subject, blank line, body).",
    "For calendar invites, use ISO 8601 dateTimes and include attendees as [{ email }]. Always set sendUpdates:'all' so invites are emailed.",
    "Resolve relative dates (e.g. 'next Thursday at 9am') against the current date above.",
    "Be concise. After completing actions, briefly confirm what you did (recipients, times).",
  ].join("\n");
}

export const agentService = {
  /** Run a single-turn agent request scoped to the tenant's integrations. */
  async run(tenantId: string, prompt: string): Promise<string> {
    const corsair = tenantClientFor(tenantId);
    const openai = await aiService.clientFor(tenantId);

    const tools = new OpenAIAgentsProvider().build({
      corsair: corsair as unknown as Record<string, unknown>,
      tool,
      tenantId,
    });

    const agent = new Agent({
      name: "Corsair Assistant",
      instructions: instructions(),
      tools,
      model: new OpenAIChatCompletionsModel(openai, AI_MODELS.fast),
    });

    const result = await run(agent, prompt, { maxTurns: 12 });
    return result.finalOutput ?? "Done.";
  },
};
