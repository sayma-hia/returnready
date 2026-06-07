import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/db";
import type { AnswerEvaluation, Question } from "@/types";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  const userName = session?.user?.name;

  const { sessionType, difficulty, market, focusAreas, evaluations, questions, answerTexts } = await req.json() as {
    sessionType: string;
    difficulty: string;
    market: string;
    focusAreas: string[];
    evaluations: AnswerEvaluation[];
    questions: Question[];
    answerTexts: string[];
  };

  const avgScore = evaluations.length > 0
    ? evaluations.reduce((sum, ev) => {
        const vals = Object.values(ev.scores) as number[];
        return sum + vals.reduce((a, b) => a + b, 0) / vals.length;
      }, 0) / evaluations.length
    : 0;

  const confidenceScore = evaluations.length > 0
    ? evaluations.reduce((sum, ev) => sum + ev.scores.confidence, 0) / evaluations.length
    : 0;

  const undersellingCount = evaluations.filter((ev) => ev.underselling_detected).length;

  let userId: string | null = null;
  if (email) {
    const { data: existing } = await supabase.from("users").select("id").eq("email", email).single();
    if (existing) {
      userId = existing.id;
    } else {
      const { data: created } = await supabase
        .from("users").insert({ email, name: userName }).select("id").single();
      userId = created?.id ?? null;
    }
  }

  const { data: saved, error } = await supabase
    .from("sessions")
    .insert({
      user_id: userId,
      session_type: sessionType,
      focus_areas: focusAreas,
      difficulty,
      market_style: market,
      overall_score: Math.round(avgScore * 10) / 10,
      confidence_score: Math.round(confidenceScore * 10) / 10,
      underselling_count: undersellingCount,
    })
    .select("id")
    .single();

  if (error || !saved) {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }

  if (evaluations.length > 0) {
    await supabase.from("session_answers").insert(
      evaluations.map((ev, i) => ({
        session_id: saved.id,
        question_text: questions[i]?.question ?? "",
        question_category: questions[i]?.category ?? "",
        answer_text: answerTexts[i] ?? "",
        score_clarity: ev.scores.clarity,
        score_depth: ev.scores.depth,
        score_confidence: ev.scores.confidence,
        score_relevance: ev.scores.relevance,
        feedback: ev.feedback,
        underselling_detected: ev.underselling_detected,
        underselling_phrases: ev.underselling_phrases,
        stronger_version: ev.stronger_version,
      }))
    );
  }

  return NextResponse.json({ sessionId: saved.id });
}
