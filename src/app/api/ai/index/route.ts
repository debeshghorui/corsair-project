import { NextResponse } from "next/server";

import { getCurrentUser } from "@/server/auth/session";
import { aiIndexService } from "@/server/services/aiIndexService";
import { MissingOpenAiKeyError } from "@/server/services/aiService";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const indexed = await aiIndexService.indexCachedBatch(user.id, 12);
    return NextResponse.json({ indexed });
  } catch (err) {
    if (err instanceof MissingOpenAiKeyError) {
      return NextResponse.json({ indexed: 0, error: "no_key" }, { status: 200 });
    }
    console.error("[api/ai/index]", err);
    return NextResponse.json({ indexed: 0, error: "failed" }, { status: 200 });
  }
}
