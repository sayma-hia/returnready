"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import UndersellAlert from "@/components/UndersellAlert";
import { NarrativeResult } from "@/types";

const QUESTIONS = [
  "How long was your career break and what was the reason?",
  "What did you learn or gain during that time — even informally?",
  "What made you decide you're ready to return now?",
  "What are you most excited about in your next role?",
  "Is there anything about the gap you're worried about explaining?",
];

const UNDERSELL_PATTERNS = [/\bjust\b/gi, /\bonly\b/gi, /\bmerely\b/gi, /i wasn't really/gi, /i know it'?s? not much/gi, /i think\b/gi, /\bmaybe\b/gi, /\bsort of\b/gi, /\bkind of\b/gi, /sorry for the time/gi, /i know there'?s? a gap/gi];

function detectUnderselling(text: string): string[] {
  const found: string[] = [];
  for (const pattern of UNDERSELL_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) found.push(...matches.map((m) => m.toLowerCase()));
  }
  return [...new Set(found)];
}

export default function NarrativePage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(5).fill(""));
  const [currentInput, setCurrentInput] = useState("");
  const [narrative, setNarrative] = useState<NarrativeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"brief" | "full" | "pivot">("brief");
  const [undersellWarnings, setUndersellWarnings] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  function handleAnswer() {
    if (!currentInput.trim()) return;
    const warnings = detectUnderselling(currentInput);
    setUndersellWarnings(warnings);
    const newAnswers = [...answers];
    newAnswers[currentQ] = currentInput;
    setAnswers(newAnswers);
    setCurrentInput("");
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      setDone(true);
      buildNarrative(newAnswers);
    }
  }

  async function buildNarrative(finalAnswers: string[]) {
    setLoading(true);
    const stored = typeof window !== "undefined" ? localStorage.getItem("onboarding") : null;
    const profile = stored ? JSON.parse(stored) : {};
    try {
      const res = await fetch("/api/build-narrative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: profile.targetRole ?? "Software Engineer",
          gapType: profile.gapType ?? "other",
          gapDuration: profile.gapStart ?? "some time",
          answers: finalAnswers,
        }),
      });
      const data = await res.json();
      setNarrative(data);
    } catch {
      setNarrative({
        brief: "Unable to generate narrative — please try again.",
        full: "",
        pivot_forward: "",
        coaching_note: "",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <h1 className="font-serif text-3xl font-bold text-[#1B4F72] mb-2">Build your gap narrative</h1>
      <p className="text-[#6B7280] mb-10">Answer 5 short questions. We&apos;ll turn your answers into a confident, interview-ready story.</p>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left — Conversation */}
        <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 flex flex-col gap-4">
          <div className="space-y-4 min-h-[320px]">
            {answers.map((ans, i) => {
              if (!ans && i !== currentQ) return null;
              return (
                <div key={i} className="space-y-2">
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#E8F2EF] flex items-center justify-center text-[#4A7C6F] text-xs font-bold shrink-0 mt-0.5">AI</div>
                    <p className="text-sm text-[#1B4F72] font-medium pt-0.5">{QUESTIONS[i]}</p>
                  </div>
                  {ans && (
                    <div className="ml-10">
                      <p className="text-sm text-[#6B7280] bg-[#FAF8F4] rounded-lg p-3 leading-relaxed">{ans}</p>
                    </div>
                  )}
                </div>
              );
            })}

            {!done && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#E8F2EF] flex items-center justify-center text-[#4A7C6F] text-xs font-bold shrink-0 mt-0.5">AI</div>
                    <p className="text-sm text-[#1B4F72] font-medium pt-0.5">{QUESTIONS[currentQ]}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {undersellWarnings.length > 0 && (
            <UndersellAlert phrases={undersellWarnings} />
          )}

          {!done && (
            <div className="flex gap-2 mt-auto">
              <textarea
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAnswer(); } }}
                placeholder="Type your answer... (Enter to submit)"
                rows={3}
                className="flex-1 border border-[#E5E0D8] rounded-xl px-3 py-2.5 text-sm text-[#1B4F72] outline-none focus:border-[#4A7C6F] bg-[#FAF8F4] resize-none"
              />
              <button
                onClick={handleAnswer}
                disabled={!currentInput.trim()}
                className="self-end bg-[#4A7C6F] hover:bg-[#2E5C52] disabled:opacity-40 text-white p-3 rounded-xl transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          )}

          {done && !loading && (
            <p className="text-sm text-[#10B981] font-medium text-center">
              All done — your narrative is ready on the right →
            </p>
          )}
        </div>

        {/* Right — Narrative output */}
        <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6">
          <h2 className="font-semibold text-[#1B4F72] mb-4">Your narrative</h2>

          {loading && (
            <div className="flex items-center gap-3 text-[#6B7280] py-10 justify-center">
              <Loader2 size={20} className="animate-spin text-[#4A7C6F]" />
              <span className="text-sm">Building your narrative...</span>
            </div>
          )}

          {!loading && !narrative && (
            <div className="text-center py-10 text-[#6B7280] text-sm">
              <p>Your narrative will appear here as you answer the questions.</p>
            </div>
          )}

          {narrative && (
            <div>
              {narrative.coaching_note && (
                <div className="bg-[#E8F2EF] rounded-xl p-4 mb-5 text-sm text-[#2E5C52] font-medium">
                  {narrative.coaching_note}
                </div>
              )}
              <div className="flex gap-2 mb-5">
                {(["brief", "full", "pivot"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? "bg-[#4A7C6F] text-white"
                        : "bg-[#FAF8F4] text-[#6B7280] hover:text-[#1B4F72]"
                    }`}
                  >
                    {tab === "brief" ? "Brief (30s)" : tab === "full" ? "Full (2 min)" : "Pivot forward"}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="text-[#1B4F72] leading-relaxed text-sm">
                    {activeTab === "brief" ? narrative.brief : activeTab === "full" ? narrative.full : narrative.pivot_forward}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
