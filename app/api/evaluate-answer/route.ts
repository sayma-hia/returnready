import { NextRequest, NextResponse } from "next/server";
import { chatJSON } from "@/lib/openai";
import { ANSWER_EVALUATION_PROMPT, fillPrompt } from "@/lib/prompts";
import { AnswerEvaluation } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, category, answer, gapDuration, role, gapType } = body;

    const prompt = fillPrompt(ANSWER_EVALUATION_PROMPT, {
      question,
      category,
      answer,
      gap_duration: gapDuration,
      role,
      gap_type: gapType,
    });

    const result = await chatJSON<AnswerEvaluation>(prompt);
    return NextResponse.json(result);
  } catch (err) {
    console.error("evaluate-answer error:", err);
    return NextResponse.json({ error: "Failed to evaluate answer" }, { status: 500 });
  }
}
