"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lightbulb, ArrowRight, SkipForward } from "lucide-react";
import UndersellAlert from "@/components/UndersellAlert";
import { Question, AnswerEvaluation } from "@/types";

const QUESTION_COUNT: Record<string, number> = { full: 8, quick: 4, narrative: 2 };

function SessionContent() {
  const router = useRouter();
  const params = useSearchParams();
  const sessionType = params.get("sessionType") ?? "quick";
  const difficulty = params.get("difficulty") ?? "building";
  const market = params.get("market") ?? "nz_apac";
  const focusAreas = params.get("focusAreas")?.split(",") ?? ["gap_narrative"];

  const total = QUESTION_COUNT[sessionType] ?? 4;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [evaluations, setEvaluations] = useState<AnswerEvaluation[]>([]);
  const [answerTexts, setAnswerTexts] = useState<string[]>([]);
  const [currentEval, setCurrentEval] = useState<AnswerEvaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadQuestions = useCallback(async () => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("onboarding") : null;
    const profile = stored ? JSON.parse(stored) : {};
    try {
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          count: total,
          seniority: profile.seniority ?? "senior",
          role: profile.targetRole ?? "Software Engineer",
          market,
          focusAreas,
          difficulty,
          gapType: profile.gapType ?? "other",
          gapDuration: profile.gapStart ?? "several months",
        }),
      });
      const data = await res.json();
      setQuestions(data.questions ?? []);
    } catch {
      setQuestions([{ question: "Tell me about your career gap.", category: "gap_narrative", hint: "Keep it honest, brief, and forward-looking." }]);
    } finally {
      setLoading(false);
    }
  }, [total, market, difficulty, focusAreas]);

  useEffect(() => { loadQuestions(); }, [loadQuestions]);

  async function handleSubmit() {
    if (!answer.trim() || !questions[current]) return;
    setEvaluating(true);
    const stored = typeof window !== "undefined" ? localStorage.getItem("onboarding") : null;
    const profile = stored ? JSON.parse(stored) : {};
    try {
      const res = await fetch("/api/evaluate-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questions[current].question,
          category: questions[current].category,
          answer,
          gapDuration: profile.gapStart ?? "several months",
          role: profile.targetRole ?? "Software Engineer",
          gapType: profile.gapType ?? "other",
        }),
      });
      const ev = await res.json();
      setCurrentEval(ev);
      setEvaluations((prev) => [...prev, ev]);
      setAnswerTexts((prev) => [...prev, answer]);
    } catch {
      setCurrentEval(null);
    } finally {
      setEvaluating(false);
    }
  }

  async function handleNext() {
    if (current + 1 >= total) {
      setSaving(true);
      try {
        const res = await fetch("/api/save-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionType, difficulty, market, focusAreas,
            evaluations,
            questions,
            answerTexts,
          }),
        });
        const { sessionId } = await res.json();
        router.push(`/report/${sessionId}`);
      } catch {
        router.push("/dashboard");
      }
      return;
    }
    setCurrent((c) => c + 1);
    setAnswer("");
    setCurrentEval(null);
    setHint(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-3">
          <Loader2 size={28} className="animate-spin text-[#4A7C6F] mx-auto" />
          <p className="text-[#6B7280] text-sm">Generating your questions...</p>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const categoryLabel: Record<string, string> = {
    technical: "Technical", behavioural: "Behavioural", gap_narrative: "Gap narrative", culture: "Culture fit",
  };
  const categoryColor: Record<string, string> = {
    technical: "bg-blue-100 text-blue-700", behavioural: "bg-purple-100 text-purple-700",
    gap_narrative: "bg-[#E8F2EF] text-[#4A7C6F]", culture: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-10">
        <p className="text-sm font-medium text-[#1B4F72]">Question {current + 1} of {total}</p>
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={`h-1.5 w-6 rounded-full ${i < current ? "bg-[#4A7C6F]" : i === current ? "bg-[#4A7C6F]/50" : "bg-[#E5E0D8]"}`} />
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          {q && (
            <>
              <div>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 ${categoryColor[q.category] ?? "bg-gray-100 text-gray-700"}`}>
                  {categoryLabel[q.category] ?? q.category}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1B4F72] leading-snug">{q.question}</h2>
              </div>

              {hint && (
                <div className="bg-[#E8F2EF] border border-[#4A7C6F]/20 rounded-xl p-4 text-sm text-[#2E5C52]">
                  <p className="font-medium mb-1 flex items-center gap-1.5"><Lightbulb size={14} /> Hint</p>
                  <p>{hint}</p>
                </div>
              )}

              {currentEval && currentEval.underselling_detected && (
                <UndersellAlert phrases={currentEval.underselling_phrases} strongerVersion={currentEval.stronger_version} />
              )}

              {currentEval ? (
                <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 space-y-4">
                  <div className="grid grid-cols-4 gap-3 text-center">
                    {(["clarity", "depth", "confidence", "relevance"] as const).map((dim) => (
                      <div key={dim} className="bg-[#FAF8F4] rounded-xl p-3">
                        <p className="text-xl font-bold font-serif text-[#4A7C6F]">{currentEval.scores[dim]}</p>
                        <p className="text-xs text-[#6B7280] capitalize mt-0.5">{dim}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[#E5E0D8] pt-4">
                    <p className="text-sm text-[#1B4F72] leading-relaxed">{currentEval.feedback}</p>
                  </div>
                  {currentEval.strength && (
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-[#10B981] font-medium shrink-0">+</span>
                      <p className="text-[#6B7280]">{currentEval.strength}</p>
                    </div>
                  )}
                  <button onClick={handleNext} disabled={saving} className="w-full flex items-center justify-center gap-2 bg-[#4A7C6F] hover:bg-[#2E5C52] disabled:opacity-60 text-white font-medium py-3 rounded-xl transition-colors">
                    {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <>{current + 1 >= total ? "See full report" : "Next question"} <ArrowRight size={15} /></>}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    rows={6}
                    placeholder="Take your time. Write your answer here..."
                    className="w-full border border-[#E5E0D8] rounded-xl px-4 py-3 text-sm text-[#1B4F72] outline-none focus:border-[#4A7C6F] bg-white resize-none"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setHint(q.hint)} className="flex items-center gap-1.5 px-4 py-2.5 border border-[#E5E0D8] text-[#6B7280] hover:text-[#1B4F72] text-sm rounded-xl transition-colors">
                      <Lightbulb size={14} /> Get a hint
                    </button>
                    <button onClick={handleNext} className="flex items-center gap-1.5 px-4 py-2.5 border border-[#E5E0D8] text-[#6B7280] hover:text-[#1B4F72] text-sm rounded-xl transition-colors">
                      <SkipForward size={14} /> Skip
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!answer.trim() || evaluating}
                      className="ml-auto flex items-center gap-2 bg-[#4A7C6F] hover:bg-[#2E5C52] disabled:opacity-40 text-white font-medium px-6 py-2.5 rounded-xl transition-colors"
                    >
                      {evaluating ? <><Loader2 size={14} className="animate-spin" /> Evaluating...</> : <>Submit answer <ArrowRight size={14} /></>}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-[#E8F2EF] border border-[#4A7C6F]/20 rounded-xl p-5">
            <p className="text-xs font-semibold text-[#4A7C6F] uppercase tracking-wider mb-2">Live tip</p>
            <p className="text-sm text-[#1B4F72] leading-relaxed">
              {q?.category === "gap_narrative"
                ? "Keep your gap narrative under 60 seconds. End with energy and what you're excited about next."
                : q?.category === "technical"
                ? "Think out loud. Interviewers value your reasoning process as much as the answer."
                : "Use a specific example. 'A time when...' is always stronger than a general statement."}
            </p>
          </div>

          {evaluations.length > 0 && currentEval && (
            <div className="bg-white border border-[#E5E0D8] rounded-xl p-5">
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">Last answer</p>
              <div className="space-y-2">
                {(["clarity", "depth", "confidence", "relevance"] as const).map((dim) => (
                  <div key={dim} className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7280] capitalize">{dim}</span>
                    <span className="font-medium text-[#1B4F72]">{currentEval.scores[dim]} / 10</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white border border-[#E5E0D8] rounded-xl p-5 text-sm text-[#6B7280]">
            <p className="font-medium text-[#1B4F72] mb-2">Session</p>
            <p>Type: {sessionType}</p>
            <p>Difficulty: {difficulty}</p>
            <p>Market: {market}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SessionPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 size={28} className="animate-spin text-[#4A7C6F]" /></div>}>
      <SessionContent />
    </Suspense>
  );
}
