import { NextResponse, type NextRequest } from "next/server";

import { getCurrentUser } from "@/server/auth/session";
import { agentService } from "@/server/services/agentService";
import { MissingOpenAiKeyError } from "@/server/services/aiService";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let prompt = "";
  try {
    const body = await request.json();
    prompt = String(body?.prompt ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  try {
    const text = await agentService.run(user.id, prompt);
    return NextResponse.json({ text });
  } catch (err) {
    if (err instanceof MissingOpenAiKeyError) {
      return NextResponse.json(
        { error: "Add your OpenAI API key in settings to use the assistant." },
        { status: 400 },
      );
    }
    console.error("[api/agent]", err);
    return NextResponse.json(
      { error: "The assistant ran into an error. Please try again." },
      { status: 500 },
    );
  }
}
