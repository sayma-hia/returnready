import { NextRequest, NextResponse } from "next/server";
import { chatJSON } from "@/lib/openai";
import { NARRATIVE_BUILDER_PROMPT, fillPrompt } from "@/lib/prompts";
import { NarrativeResult } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, gapType, gapDuration, answers } = body;
    const [a1, a2, a3, a4, a5] = answers as string[];

    const prompt = fillPrompt(NARRATIVE_BUILDER_PROMPT, {
      role,
      gap_type: gapType,
      gap_duration: gapDuration,
      answer_1: a1 ?? "",
      answer_2: a2 ?? "",
      answer_3: a3 ?? "",
      answer_4: a4 ?? "",
      answer_5: a5 ?? "",
    });

    const result = await chatJSON<NarrativeResult>(prompt);
    return NextResponse.json(result);
  } catch (err) {
    console.error("build-narrative error:", err);
    return NextResponse.json({ error: "Failed to build narrative" }, { status: 500 });
  }
}
