"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { milestones } from "@/lib/data";

const SESSION_TYPE_LABEL: Record<string, string> = {
  full: "Full session",
  quick: "Quick session",
  narrative: "Gap narrative",
};

const CATEGORY_LABEL: Record<string, string> = {
  technical: "Technical",
  behavioural: "Behavioural",
  gap_narrative: "Gap narrative",
  culture: "Culture fit",
};

type Answer = {
  question_category: string;
  score_clarity: number;
  score_depth: number;
  score_confidence: number;
  score_relevance: number;
};

type SessionRow = {
  id: string;
  session_type: string;
  overall_score: number;
  confidence_score: number;
  underselling_count: number;
  completed_at: string;
  session_answers: Answer[];
};

export default function ProgressPage() {
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/get-sessions")
      .then((r) => r.json())
      .then(({ sessions: rows }) => { setSessions(rows ?? []); setLoading(false); });
  }, []);

  const confidenceData = sessions.map((s, i) => ({
    session: `S${i + 1}`,
    score: s.overall_score,
  }));

  const categoryTotals: Record<string, { total: number; count: number }> = {};
  for (const s of sessions) {
    for (const a of s.session_answers ?? []) {
      const cat = a.question_category;
      if (!categoryTotals[cat]) categoryTotals[cat] = { total: 0, count: 0 };
      const avg = (a.score_clarity + a.score_depth + a.score_confidence + a.score_relevance) / 4;
      categoryTotals[cat].total += avg;
      categoryTotals[cat].count += 1;
    }
  }
  const categoryData = Object.entries(categoryTotals).map(([cat, { total, count }]) => ({
    name: CATEGORY_LABEL[cat] ?? cat,
    score: Math.round((total / count) * 10) / 10,
  }));

  const totalUnderselling = sessions.reduce((sum, s) => sum + (s.underselling_count ?? 0), 0);
  const recentUnderselling = sessions.slice(-3).reduce((sum, s) => sum + (s.underselling_count ?? 0), 0);
  const prevUnderselling = sessions.slice(-6, -3).reduce((sum, s) => sum + (s.underselling_count ?? 0), 0);

  const earnedMilestoneIds: string[] = [];
  if (sessions.length >= 1) earnedMilestoneIds.push("first_session");
  if (sessions.length >= 5) earnedMilestoneIds.push("five_sessions");
  const hasNarrative = sessions.some((s) => s.session_type === "narrative");
  if (hasNarrative) earnedMilestoneIds.push("narrative_built");
  const hasHighScore = sessions.some((s) => s.overall_score >= 8);
  if (hasHighScore) earnedMilestoneIds.push("confidence_8");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <h1 className="font-serif text-3xl font-bold text-[#1B4F72] mb-2">Your progress</h1>
      <p className="text-[#6B7280] mb-10">Track how your confidence and scores are building over time.</p>

      {loading ? (
        <div className="text-center py-20 text-[#6B7280]">Loading your data...</div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#E5E0D8] rounded-2xl">
          <p className="text-[#1B4F72] font-medium mb-2">No sessions yet</p>
          <p className="text-sm text-[#6B7280] mb-5">Complete a practice session to start tracking your progress.</p>
          <Link href="/practice" className="inline-flex items-center gap-2 bg-[#4A7C6F] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#2E5C52] transition-colors">
            Start a session →
          </Link>
        </div>
      ) : (
        <>
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6">
              <h2 className="font-semibold text-[#1B4F72] mb-5">Score over time</h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={confidenceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D8" />
                  <XAxis dataKey="session" tick={{ fontSize: 12, fill: "#6B7280" }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: "#6B7280" }} />
                  <Tooltip
                    contentStyle={{ border: "1px solid #E5E0D8", borderRadius: "8px", fontSize: "13px" }}
                    formatter={(v) => [`${v} / 10`, "Score"]}
                  />
                  <Line type="monotone" dataKey="score" stroke="#4A7C6F" strokeWidth={2} dot={{ fill: "#4A7C6F", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6">
              <h2 className="font-semibold text-[#1B4F72] mb-5">Scores by category</h2>
              {categoryData.length === 0 ? (
                <div className="flex items-center justify-center h-[200px] text-sm text-[#6B7280]">No category data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={categoryData} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D8" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: "#6B7280" }} />
                    <Tooltip
                      contentStyle={{ border: "1px solid #E5E0D8", borderRadius: "8px", fontSize: "13px" }}
                      formatter={(v) => [`${v} / 10`, "Score"]}
                    />
                    <Bar dataKey="score" fill="#4A7C6F" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {totalUnderselling > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
              <p className="text-sm text-amber-800">
                <span className="font-semibold">Underselling trend:</span> You&apos;ve used self-deprecating language{" "}
                <span className="font-bold">{recentUnderselling} times</span> in your last 3 sessions
                {prevUnderselling > 0 && ` — down from ${prevUnderselling} before that`}. Keep going.
              </p>
            </div>
          )}

          <section className="mb-10">
            <h2 className="font-semibold text-[#1B4F72] mb-4">Milestones</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {milestones.map((m) => {
                const earned = earnedMilestoneIds.includes(m.id);
                return (
                  <div
                    key={m.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border ${
                      earned ? "border-[#10B981]/30 bg-[#10B981]/5" : "border-[#E5E0D8] bg-white opacity-50"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${earned ? "bg-[#10B981] text-white" : "bg-[#E5E0D8] text-[#6B7280]"}`}>
                      {earned ? "✓" : "—"}
                    </div>
                    <div>
                      <p className="font-medium text-[#1B4F72] text-sm">{m.label}</p>
                      <p className="text-xs text-[#6B7280] mt-0.5">{m.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="font-semibold text-[#1B4F72] mb-4">Session history</h2>
            <div className="bg-white border border-[#E5E0D8] rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#FAF8F4] text-[#6B7280] text-xs uppercase tracking-wide">
                  <tr>
                    <th className="text-left px-5 py-3">Date</th>
                    <th className="text-left px-5 py-3">Type</th>
                    <th className="text-left px-5 py-3">Score</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {[...sessions].reverse().map((s, i) => (
                    <tr key={s.id} className={i % 2 === 0 ? "" : "bg-[#FAF8F4]/50"}>
                      <td className="px-5 py-3.5 text-[#6B7280]">
                        {new Date(s.completed_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-5 py-3.5 text-[#1B4F72] font-medium">{SESSION_TYPE_LABEL[s.session_type] ?? s.session_type}</td>
                      <td className="px-5 py-3.5 font-bold text-[#4A7C6F]">{s.overall_score} / 10</td>
                      <td className="px-5 py-3.5 text-right">
                        <Link href={`/report/${s.id}`} className="text-[#4A7C6F] hover:underline text-xs font-medium">
                          View report
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
