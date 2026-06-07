"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Baby, Heart, Flame, GraduationCap, HelpCircle } from "lucide-react";
import { OnboardingData, GapType, Seniority, Market } from "@/types";

const TOTAL_STEPS = 4;

const initialData: OnboardingData = {
  gapType: null,
  gapStart: "",
  gapEnd: "",
  stillOnBreak: false,
  gapDescription: "",
  targetRole: "",
  seniority: null,
  targetMarket: null,
  timeUntilInterviews: "",
  confidenceLevel: 3,
};

const gapOptions: { value: GapType; label: string; icon: React.ElementType }[] = [
  { value: "maternity", label: "Maternity / parental leave", icon: Baby },
  { value: "caring", label: "Caring for a family member", icon: Heart },
  { value: "burnout", label: "Health or burnout recovery", icon: Flame },
  { value: "retraining", label: "Career retraining", icon: GraduationCap },
  { value: "other", label: "Other", icon: HelpCircle },
];

const confidenceLabels: Record<number, string> = {
  1: "Terrified honestly",
  2: "Pretty anxious",
  3: "Nervous but ready",
  4: "Fairly confident",
  5: "Ready to go",
};

export default function OnboardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);

  function next() {
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
    else handleSubmit();
  }
  function back() {
    if (step > 1) setStep((s) => s - 1);
  }

  function handleSubmit() {
    if (typeof window !== "undefined") {
      localStorage.setItem("onboarding", JSON.stringify(data));
    }
    router.push("/dashboard");
  }

  const canProceed =
    step === 1
      ? !!data.gapType
      : step === 2
      ? !!data.gapStart && !!data.gapDescription
      : step === 3
      ? !!data.targetRole && !!data.seniority && !!data.targetMarket && !!data.timeUntilInterviews
      : true;

  return (
    <div className="min-h-screen flex flex-col pt-20">
      {/* Progress bar */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-[#E5E0D8] z-40">
        <motion.div
          className="h-full bg-[#4A7C6F]"
          animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-xl">
          <p className="text-sm text-[#6B7280] mb-2">Step {step} of {TOTAL_STEPS}</p>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <div>
                  <h1 className="font-serif text-3xl font-bold text-[#1B4F72] mb-2">
                    What brought you here?
                  </h1>
                  <p className="text-[#6B7280] mb-8">Choose what best describes your career break.</p>
                  <div className="space-y-3">
                    {gapOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setData((d) => ({ ...d, gapType: opt.value }))}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                          data.gapType === opt.value
                            ? "border-[#4A7C6F] bg-[#E8F2EF]"
                            : "border-[#E5E0D8] bg-white hover:border-[#4A7C6F]/40"
                        }`}
                      >
                        <div className="w-9 h-9 rounded-lg bg-[#E8F2EF] flex items-center justify-center shrink-0">
                          <opt.icon size={18} className="text-[#4A7C6F]" />
                        </div>
                        <span className="font-medium text-[#1B4F72]">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h1 className="font-serif text-3xl font-bold text-[#1B4F72] mb-2">
                    Tell us about your break
                  </h1>
                  <p className="text-[#6B7280] mb-8">
                    This stays private — it helps us personalise your coaching.
                  </p>
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1B4F72] mb-1.5">
                          Gap start (month/year)
                        </label>
                        <input
                          type="month"
                          value={data.gapStart}
                          onChange={(e) => setData((d) => ({ ...d, gapStart: e.target.value }))}
                          className="w-full border border-[#E5E0D8] rounded-lg px-3 py-2.5 text-sm text-[#1B4F72] outline-none focus:border-[#4A7C6F] bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1B4F72] mb-1.5">
                          Gap end
                        </label>
                        {data.stillOnBreak ? (
                          <div className="flex items-center h-10 text-sm text-[#6B7280] italic">Still on break</div>
                        ) : (
                          <input
                            type="month"
                            value={data.gapEnd}
                            onChange={(e) => setData((d) => ({ ...d, gapEnd: e.target.value }))}
                            className="w-full border border-[#E5E0D8] rounded-lg px-3 py-2.5 text-sm text-[#1B4F72] outline-none focus:border-[#4A7C6F] bg-white"
                          />
                        )}
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-[#6B7280] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={data.stillOnBreak}
                        onChange={(e) => setData((d) => ({ ...d, stillOnBreak: e.target.checked }))}
                        className="accent-[#4A7C6F]"
                      />
                      I&apos;m still on break
                    </label>
                    <div>
                      <label className="block text-sm font-medium text-[#1B4F72] mb-1.5">
                        In a few words, what were you doing?
                      </label>
                      <textarea
                        value={data.gapDescription}
                        onChange={(e) => setData((d) => ({ ...d, gapDescription: e.target.value }))}
                        rows={4}
                        placeholder="e.g. On maternity leave caring for my daughter, also did some personal projects..."
                        className="w-full border border-[#E5E0D8] rounded-lg px-3 py-2.5 text-sm text-[#1B4F72] outline-none focus:border-[#4A7C6F] bg-white resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h1 className="font-serif text-3xl font-bold text-[#1B4F72] mb-2">
                    Where are you heading?
                  </h1>
                  <p className="text-[#6B7280] mb-8">This shapes your practice sessions.</p>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-[#1B4F72] mb-1.5">
                        Target role
                      </label>
                      <input
                        type="text"
                        value={data.targetRole}
                        onChange={(e) => setData((d) => ({ ...d, targetRole: e.target.value }))}
                        placeholder="e.g. Senior Software Engineer, AI Engineer..."
                        className="w-full border border-[#E5E0D8] rounded-lg px-3 py-2.5 text-sm text-[#1B4F72] outline-none focus:border-[#4A7C6F] bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1B4F72] mb-1.5">
                        Seniority level
                      </label>
                      <select
                        value={data.seniority ?? ""}
                        onChange={(e) => setData((d) => ({ ...d, seniority: e.target.value as Seniority }))}
                        className="w-full border border-[#E5E0D8] rounded-lg px-3 py-2.5 text-sm text-[#1B4F72] outline-none focus:border-[#4A7C6F] bg-white"
                      >
                        <option value="">Select level</option>
                        <option value="junior">Junior</option>
                        <option value="mid">Mid-level</option>
                        <option value="senior">Senior</option>
                        <option value="lead">Lead / Principal</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1B4F72] mb-1.5">
                        Target market
                      </label>
                      <select
                        value={data.targetMarket ?? ""}
                        onChange={(e) => setData((d) => ({ ...d, targetMarket: e.target.value as Market }))}
                        className="w-full border border-[#E5E0D8] rounded-lg px-3 py-2.5 text-sm text-[#1B4F72] outline-none focus:border-[#4A7C6F] bg-white"
                      >
                        <option value="">Select market</option>
                        <option value="nz_apac">New Zealand / APAC</option>
                        <option value="uk">United Kingdom</option>
                        <option value="us">United States</option>
                        <option value="south_asia">South Asia</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1B4F72] mb-2">
                        Time until interviews
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {["I'm interviewing now", "1–2 weeks", "1 month+"].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setData((d) => ({ ...d, timeUntilInterviews: opt }))}
                            className={`py-2.5 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                              data.timeUntilInterviews === opt
                                ? "border-[#4A7C6F] bg-[#E8F2EF] text-[#4A7C6F]"
                                : "border-[#E5E0D8] text-[#6B7280] hover:border-[#4A7C6F]/40"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h1 className="font-serif text-3xl font-bold text-[#1B4F72] mb-2">
                    How are you feeling about it?
                  </h1>
                  <p className="text-[#6B7280] mb-10">
                    Be honest — this sets the starting difficulty for your practice sessions. There&apos;s no wrong answer.
                  </p>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        onClick={() => setData((d) => ({ ...d, confidenceLevel: level }))}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                          data.confidenceLevel === level
                            ? "border-[#4A7C6F] bg-[#E8F2EF]"
                            : "border-[#E5E0D8] bg-white hover:border-[#4A7C6F]/40"
                        }`}
                      >
                        <span className="font-bold text-[#4A7C6F] text-lg w-6">{level}</span>
                        <span className="text-[#1B4F72] font-medium">{confidenceLabels[level]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-10">
            <button
              onClick={back}
              disabled={step === 1}
              className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#1B4F72] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              onClick={next}
              disabled={!canProceed}
              className="flex items-center gap-2 bg-[#4A7C6F] hover:bg-[#2E5C52] disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-xl transition-all hover:scale-105"
            >
              {step === TOTAL_STEPS ? "Build my return plan" : "Continue"} <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
