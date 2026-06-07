import Link from "next/link";
import { ArrowLeft, TrendingUp, TrendingDown, ChevronDown } from "lucide-react";
import ConfidenceScore from "@/components/ConfidenceScore";
import UndersellAlert from "@/components/UndersellAlert";
import { supabase } from "@/lib/db";

const SESSION_TYPE_LABEL: Record<string, string> = {
  full: "Full session",
  quick: "Quick session",
  narrative: "Gap narrative",
};

const CATEGORY_COLOR: Record<string, string> = {
  technical: "bg-blue-100 text-blue-700",
  behavioural: "bg-purple-100 text-purple-700",
  gap_narrative: "bg-[#E8F2EF] text-[#4A7C6F]",
  culture: "bg-amber-100 text-amber-700",
};

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: session } = await supabase
    .from("sessions")
    .select(`
      id, user_id, session_type, difficulty, market_style,
      overall_score, confidence_score, underselling_count, completed_at,
      session_answers (
        id, question_text, question_category, answer_text,
        score_clarity, score_depth, score_confidence, score_relevance,
        feedback, underselling_detected, underselling_phrases, stronger_version
      )
    `)
    .eq("id", id)
    .single();

  if (!session) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16 text-center">
        <p className="text-[#1B4F72] font-medium text-lg mb-2">Session not found</p>
        <Link href="/progress" className="text-[#4A7C6F] text-sm hover:underline">← Back to Progress</Link>
      </div>
    );
  }

  // Find previous session for score comparison
  const { data: prevSession } = await supabase
    .from("sessions")
    .select("overall_score")
    .eq("user_id", session.user_id)
    .lt("completed_at", session.completed_at)
    .order("completed_at", { ascending: false })
    .limit(1)
    .single();

  const scoreDiff = prevSession ? session.overall_score - prevSession.overall_score : 0;
  const answers = session.session_answers ?? [];

  // Derive summary from answers
  const undersellAnswers = answers.filter((a) => a.underselling_detected);
  const topAnswer = [...answers].sort((a, b) => {
    const avgA = (a.score_clarity + a.score_depth + a.score_confidence + a.score_relevance) / 4;
    const avgB = (b.score_clarity + b.score_depth + b.score_confidence + b.score_relevance) / 4;
    return avgB - avgA;
  })[0];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <Link href="/progress" className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#4A7C6F] mb-8 transition-colors">
        <ArrowLeft size={14} /> Back to Progress
      </Link>

      <div className="bg-white border border-[#E5E0D8] rounded-2xl p-8 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-sm text-[#6B7280] mb-1">
              {new Date(session.completed_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              {" · "}{SESSION_TYPE_LABEL[session.session_type] ?? session.session_type}
            </p>
            <ConfidenceScore score={session.overall_score} size="lg" label="Overall score" />
          </div>
          {prevSession && (
            <div className="flex items-center gap-1.5 text-sm font-medium">
              {scoreDiff >= 0 ? (
                <><TrendingUp size={16} className="text-[#10B981]" /><span className="text-[#10B981]">+{scoreDiff.toFixed(1)} vs last session</span></>
              ) : (
                <><TrendingDown size={16} className="text-amber-500" /><span className="text-amber-500">{scoreDiff.toFixed(1)} vs last session</span></>
              )}
            </div>
          )}
        </div>
      </div>

      {answers.length > 0 && (
        <>
          <h2 className="font-semibold text-[#1B4F72] mb-4">Question breakdown</h2>
          <div className="space-y-4 mb-8">
            {answers.map((a, i) => {
              const overall = (a.score_clarity + a.score_depth + a.score_confidence + a.score_relevance) / 4;
              return (
                <details key={a.id ?? i} className="group bg-white border border-[#E5E0D8] rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLOR[a.question_category] ?? "bg-gray-100 text-gray-700"}`}>
                        {a.question_category.replace("_", " ")}
                      </span>
                      <span className="text-sm font-medium text-[#1B4F72] line-clamp-1">{a.question_text}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold text-[#4A7C6F]">{overall.toFixed(1)}</span>
                      <ChevronDown size={16} className="text-[#6B7280] group-open:rotate-180 transition-transform" />
                    </div>
                  </summary>
                  <div className="px-5 pb-5 space-y-4 border-t border-[#E5E0D8]">
                    <p className="text-sm text-[#6B7280] italic pt-4">&ldquo;{a.answer_text}&rdquo;</p>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {(["score_clarity", "score_depth", "score_confidence", "score_relevance"] as const).map((dim) => (
                        <div key={dim} className="bg-[#FAF8F4] rounded-lg p-2">
                          <p className="font-bold text-[#4A7C6F]">{a[dim]}</p>
                          <p className="text-xs text-[#6B7280] capitalize">{dim.replace("score_", "")}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-[#1B4F72] leading-relaxed">{a.feedback}</p>
                    {a.underselling_detected && (
                      <UndersellAlert phrases={a.underselling_phrases} strongerVersion={a.stronger_version} />
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        </>
      )}

      <div className="bg-[#E8F2EF] border border-[#4A7C6F]/20 rounded-2xl p-7 space-y-4 mb-6">
        <h2 className="font-semibold text-[#1B4F72]">Summary</h2>
        {topAnswer && (
          <div>
            <p className="text-xs font-semibold text-[#4A7C6F] uppercase tracking-wide mb-1">Top strength</p>
            <p className="text-sm text-[#1B4F72]">Strongest answer: &ldquo;{topAnswer.question_text}&rdquo;</p>
          </div>
        )}
        {undersellAnswers.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">Focus area</p>
            <p className="text-sm text-[#1B4F72]">
              Underselling detected in {undersellAnswers.length} answer{undersellAnswers.length > 1 ? "s" : ""} — watch for self-deprecating language.
            </p>
          </div>
        )}
        <div>
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1">Recommended next</p>
          <p className="text-sm text-[#1B4F72]">
            {session.overall_score < 6 ? "Focus on gap narrative — build your core story first." :
             session.overall_score < 8 ? "Keep practising — you're building momentum." :
             "Strong session. Try a higher difficulty next time."}
          </p>
        </div>
      </div>

      <div className="bg-[#4A7C6F] rounded-2xl p-7 text-white text-center">
        <p className="font-serif text-lg font-bold mb-1">ReturnReady session complete</p>
        <p className="text-[#E8F2EF] text-sm mb-1">
          Score: {session.overall_score} · {new Date(session.completed_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
        </p>
        <p className="text-[#E8F2EF]/70 text-xs mb-5">returnready.vercel.app</p>
        <Link
          href="/practice"
          className="inline-flex items-center gap-2 bg-white text-[#4A7C6F] font-medium px-5 py-2.5 rounded-lg text-sm hover:bg-[#FAF8F4] transition-colors"
        >
          Practice again <ArrowLeft size={14} className="rotate-180" />
        </Link>
      </div>
    </div>
  );
}
