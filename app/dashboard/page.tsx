"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Zap, TrendingUp, BookOpen } from "lucide-react";
import { getTipOfTheDay, gapTypeLabels, marketLabels, seniorityLabels } from "@/lib/data";
import { OnboardingData } from "@/types";

const recentSessions = [
  { id: "1", date: "2025-05-10", type: "Quick session", score: 7.4 },
  { id: "2", date: "2025-05-08", type: "Full session", score: 6.9 },
  { id: "3", date: "2025-05-05", type: "Gap narrative", score: 8.1 },
];

export default function DashboardPage() {
  const [profile, setProfile] = useState<OnboardingData | null>(null);
  const [name, setName] = useState("there");
  const tip = getTipOfTheDay();

  useEffect(() => {
    const stored = localStorage.getItem("onboarding");
    if (stored) setProfile(JSON.parse(stored));
  }, []);

  const steps = [
    {
      done: !!profile?.gapDescription,
      label: "Build your gap narrative",
      href: "/narrative",
      icon: BookOpen,
      desc: "Turn your story into a confident interview answer",
    },
    {
      done: false,
      label: "Start your first practice session",
      href: "/practice",
      icon: Zap,
      desc: "A short 4-question session to get you started",
    },
    {
      done: false,
      label: "Review your skills baseline",
      href: "/practice?focus=technical",
      icon: TrendingUp,
      desc: "See where you stand on technical fundamentals",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <div className="mb-10">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B4F72] mb-1">
          Welcome back, {name}. Let&apos;s get you ready.
        </h1>
        <p className="text-[#6B7280]">Here&apos;s your personalised return plan.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Return plan */}
          <section>
            <h2 className="font-semibold text-[#1B4F72] mb-4">Your return plan</h2>
            <div className="space-y-3">
              {steps.map((step, i) => (
                <Link
                  key={i}
                  href={step.href}
                  className={`flex items-start gap-4 p-5 rounded-xl border transition-all hover:shadow-sm ${
                    step.done
                      ? "border-[#10B981]/30 bg-[#10B981]/5"
                      : "border-[#E5E0D8] bg-white hover:border-[#4A7C6F]/40"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${step.done ? "bg-[#10B981]/15" : "bg-[#E8F2EF]"}`}>
                    <step.icon size={18} className={step.done ? "text-[#10B981]" : "text-[#4A7C6F]"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${step.done ? "text-[#10B981] line-through" : "text-[#1B4F72]"}`}>
                      {step.label}
                    </p>
                    <p className="text-sm text-[#6B7280] mt-0.5">{step.desc}</p>
                  </div>
                  {!step.done && <ArrowRight size={16} className="text-[#6B7280] mt-1 shrink-0" />}
                </Link>
              ))}
            </div>
          </section>

          {/* Recent sessions */}
          <section>
            <h2 className="font-semibold text-[#1B4F72] mb-4">Recent sessions</h2>
            {recentSessions.length === 0 ? (
              <div className="text-center py-10 text-[#6B7280] bg-white border border-[#E5E0D8] rounded-xl">
                <p>No sessions yet.</p>
                <Link href="/practice" className="text-[#4A7C6F] text-sm font-medium mt-2 inline-block hover:underline">
                  Start your first session →
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {recentSessions.map((s) => (
                  <div key={s.id} className="flex items-center justify-between bg-white border border-[#E5E0D8] rounded-xl px-5 py-3.5">
                    <div>
                      <p className="font-medium text-[#1B4F72] text-sm">{s.type}</p>
                      <p className="text-xs text-[#6B7280]">{new Date(s.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-[#4A7C6F]">{s.score} / 10</span>
                      <Link href={`/report/${s.id}`} className="text-xs text-[#4A7C6F] hover:underline font-medium">
                        View report
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Quick start */}
          <Link
            href="/practice?type=quick"
            className="flex items-center justify-between bg-[#4A7C6F] hover:bg-[#2E5C52] text-white rounded-2xl p-7 transition-all group"
          >
            <div>
              <p className="font-serif text-xl font-bold mb-1">Start a 5-question practice session</p>
              <p className="text-[#E8F2EF] text-sm">~10 minutes · Returner-aware feedback</p>
            </div>
            <ArrowRight size={22} className="shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Tip of the day */}
          <div className="bg-[#E8F2EF] border border-[#4A7C6F]/20 rounded-xl p-5">
            <p className="text-xs font-semibold text-[#4A7C6F] uppercase tracking-wider mb-2">Tip of the day</p>
            <p className="text-sm text-[#1B4F72] leading-relaxed">{tip}</p>
          </div>

          {/* Profile summary */}
          {profile && (
            <div className="bg-white border border-[#E5E0D8] rounded-xl p-5">
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">Your profile</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Role</span>
                  <span className="font-medium text-[#1B4F72] text-right max-w-[140px] truncate">{profile.targetRole || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Market</span>
                  <span className="font-medium text-[#1B4F72]">{profile.targetMarket ? marketLabels[profile.targetMarket] : "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Gap type</span>
                  <span className="font-medium text-[#1B4F72]">{profile.gapType ? gapTypeLabels[profile.gapType] : "Not set"}</span>
                </div>
                {profile.seniority && (
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Level</span>
                    <span className="font-medium text-[#1B4F72]">{seniorityLabels[profile.seniority]}</span>
                  </div>
                )}
              </div>
              <Link href="/onboard" className="text-xs text-[#4A7C6F] hover:underline mt-3 inline-block">
                Edit profile →
              </Link>
            </div>
          )}

          {/* Streak */}
          <div className="bg-white border border-[#E5E0D8] rounded-xl p-5">
            <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">This week</p>
            <p className="text-3xl font-bold font-serif text-[#4A7C6F]">0</p>
            <p className="text-sm text-[#6B7280]">days practiced</p>
          </div>
        </div>
      </div>
    </div>
  );
}
