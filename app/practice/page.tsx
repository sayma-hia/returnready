"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

const SESSION_TYPES = [
  { value: "full", label: "Full session", meta: "8 questions · ~20 mins" },
  { value: "quick", label: "Quick session", meta: "4 questions · ~10 mins" },
  { value: "narrative", label: "Gap narrative only", meta: "2 questions · ~5 mins" },
];

const FOCUS_AREAS = [
  { value: "technical", label: "Technical", desc: "React, TypeScript, system design" },
  { value: "behavioural", label: "Behavioural", desc: "STAR method, leadership, conflict" },
  { value: "gap_narrative", label: "Gap narrative", desc: "Practise talking about your break" },
  { value: "role_specific", label: "Role-specific", desc: "Tailored to your target role" },
];

const DIFFICULTIES = [
  { value: "gentle", label: "Gentle start", desc: "Core skills, confidence-building" },
  { value: "building", label: "Building confidence", desc: "A step up from gentle" },
  { value: "full", label: "Full interview pace", desc: "System design, senior-level questions" },
];

const MARKETS = [
  { value: "nz_apac", label: "NZ / APAC", desc: "Collaborative, values-focused" },
  { value: "uk", label: "United Kingdom", desc: "Competency-based" },
  { value: "us", label: "United States", desc: "STAR heavy, metrics-driven" },
  { value: "south_asia", label: "South Asia", desc: "Technical depth" },
  { value: "other", label: "Other", desc: "Balanced approach" },
];

export default function PracticePage() {
  const router = useRouter();
  const [sessionType, setSessionType] = useState("quick");
  const [focusAreas, setFocusAreas] = useState<string[]>(["gap_narrative"]);
  const [difficulty, setDifficulty] = useState("building");
  const [market, setMarket] = useState("nz_apac");

  function toggleFocus(val: string) {
    setFocusAreas((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  }

  function handleStart() {
    const params = new URLSearchParams({ sessionType, difficulty, market, focusAreas: focusAreas.join(",") });
    router.push(`/session?${params}`);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <h1 className="font-serif text-3xl font-bold text-[#1B4F72] mb-2">Set up your session</h1>
      <p className="text-[#6B7280] mb-10">Customise your practice session before you begin.</p>

      <div className="space-y-8">
        {/* Session type */}
        <section>
          <h2 className="font-semibold text-[#1B4F72] mb-3">Session type</h2>
          <div className="space-y-2">
            {SESSION_TYPES.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSessionType(opt.value)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                  sessionType === opt.value
                    ? "border-[#4A7C6F] bg-[#E8F2EF]"
                    : "border-[#E5E0D8] bg-white hover:border-[#4A7C6F]/40"
                }`}
              >
                <span className="font-medium text-[#1B4F72]">{opt.label}</span>
                <span className="text-sm text-[#6B7280]">{opt.meta}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Focus areas */}
        <section>
          <h2 className="font-semibold text-[#1B4F72] mb-3">Focus areas <span className="text-[#6B7280] font-normal text-sm">(multi-select)</span></h2>
          <div className="grid grid-cols-2 gap-2">
            {FOCUS_AREAS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => toggleFocus(opt.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  focusAreas.includes(opt.value)
                    ? "border-[#4A7C6F] bg-[#E8F2EF]"
                    : "border-[#E5E0D8] bg-white hover:border-[#4A7C6F]/40"
                }`}
              >
                <p className="font-medium text-[#1B4F72] text-sm">{opt.label}</p>
                <p className="text-xs text-[#6B7280] mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Difficulty */}
        <section>
          <h2 className="font-semibold text-[#1B4F72] mb-3">Difficulty</h2>
          <div className="grid grid-cols-3 gap-2">
            {DIFFICULTIES.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDifficulty(opt.value)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  difficulty === opt.value
                    ? "border-[#4A7C6F] bg-[#E8F2EF]"
                    : "border-[#E5E0D8] bg-white hover:border-[#4A7C6F]/40"
                }`}
              >
                <p className="font-medium text-[#1B4F72] text-sm">{opt.label}</p>
                <p className="text-xs text-[#6B7280] mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Market */}
        <section>
          <h2 className="font-semibold text-[#1B4F72] mb-3">Market style</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {MARKETS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setMarket(opt.value)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  market === opt.value
                    ? "border-[#4A7C6F] bg-[#E8F2EF]"
                    : "border-[#E5E0D8] bg-white hover:border-[#4A7C6F]/40"
                }`}
              >
                <p className="font-medium text-[#1B4F72] text-sm">{opt.label}</p>
                <p className="text-xs text-[#6B7280] mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </section>

        <button
          onClick={handleStart}
          disabled={focusAreas.length === 0}
          className="w-full flex items-center justify-center gap-2 bg-[#4A7C6F] hover:bg-[#2E5C52] disabled:opacity-40 text-white font-semibold py-4 rounded-xl transition-all hover:scale-[1.02]"
        >
          Begin session <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
