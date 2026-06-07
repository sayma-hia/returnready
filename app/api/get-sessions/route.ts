import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) return NextResponse.json({ sessions: [] });

  const { data: user } = await supabase.from("users").select("id").eq("email", email).single();
  if (!user) return NextResponse.json({ sessions: [] });

  const { data: sessions } = await supabase
    .from("sessions")
    .select(`
      id, session_type, difficulty, market_style,
      overall_score, confidence_score, underselling_count, completed_at,
      session_answers (
        question_category, answer_text, question_text,
        score_clarity, score_depth, score_confidence, score_relevance,
        feedback, underselling_detected, underselling_phrases, stronger_version
      )
    `)
    .eq("user_id", user.id)
    .order("completed_at", { ascending: true })
    .limit(50);

  return NextResponse.json({ sessions: sessions ?? [] });
}
