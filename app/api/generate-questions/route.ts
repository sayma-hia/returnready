import { NextRequest, NextResponse } from "next/server";
import { chatJSON } from "@/lib/openai";
import { QUESTION_GENERATION_PROMPT, fillPrompt } from "@/lib/prompts";
import { Question } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { count = 8, seniority, role, market, focusAreas, difficulty, gapType, gapDuration } = body;

    const prompt = fillPrompt(QUESTION_GENERATION_PROMPT, {
      count: String(count),
      seniority,
      role,
      market,
      focus_areas: Array.isArray(focusAreas) ? focusAreas.join(", ") : focusAreas,
      difficulty,
      gap_type: gapType,
      gap_duration: gapDuration,
    });

    const result = await chatJSON<{ questions?: Question[] } | Question[]>(prompt);
    const questions = Array.isArray(result) ? result : (result as { questions?: Question[] }).questions ?? [];

    return NextResponse.json({ questions });
  } catch (err) {
    console.error("generate-questions error:", err);
    return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 });
  }
}
