"use client";

import Link from "next/link";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { milestones } from "@/lib/data";

const confidenceData = [
  { session: "S1", score: 5.2 },
  { session: "S2", score: 6.1 },
  { session: "S3", score: 6.9 },
  { session: "S4", score: 7.4 },
];

const categoryData = [
  { name: "Technical", score: 7.1 },
  { name: "Behavioural", score: 8.0 },
  { name: "Gap narrative", score: 6.5 },
];

const sessionHistory = [
  { id: "3", date: "2025-05-10", type: "Quick session", score: 7.4 },
  { id: "2", date: "2025-05-08", type: "Full session", score: 6.9 },
  { id: "1", date: "2025-05-05", type: "Gap narrative", score: 6.1 },
  { id: "0", date: "2025-05-01", type: "Quick session", score: 5.2 },
];

const earnedMilestones = ["first_session", "narrative_built"];

export default function ProgressPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <h1 className="font-serif text-3xl font-bold text-[#1B4F72] mb-2">Your progress</h1>
      <p className="text-[#6B7280] mb-10">Track how your confidence and scores are building over time.</p>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Confidence line chart */}
        <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6">
          <h2 className="font-semibold text-[#1B4F72] mb-5">Confidence over time</h2>
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

        {/* Category bar chart */}
        <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6">
          <h2 className="font-semibold text-[#1B4F72] mb-5">Scores by category</h2>
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
        </div>
      </div>

      {/* Underselling trend */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
        <p className="text-sm text-amber-800">
          <span className="font-semibold">Underselling trend:</span> You&apos;ve used self-deprecating language{" "}
          <span className="font-bold">3 times</span> this week — down from 8 last week. Keep going.
        </p>
      </div>

      {/* Milestones */}
      <section className="mb-10">
        <h2 className="font-semibold text-[#1B4F72] mb-4">Milestones</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {milestones.map((m) => {
            const earned = earnedMilestones.includes(m.id);
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

      {/* Session history */}
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
              {sessionHistory.map((s, i) => (
                <tr key={s.id} className={i % 2 === 0 ? "" : "bg-[#FAF8F4]/50"}>
                  <td className="px-5 py-3.5 text-[#6B7280]">
                    {new Date(s.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5 text-[#1B4F72] font-medium">{s.type}</td>
                  <td className="px-5 py-3.5 font-bold text-[#4A7C6F]">{s.score} / 10</td>
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
    </div>
  );
}
