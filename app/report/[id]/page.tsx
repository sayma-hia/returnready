import Link from "next/link";
import { ArrowLeft, TrendingUp, TrendingDown, ChevronDown } from "lucide-react";
import ConfidenceScore from "@/components/ConfidenceScore";
import UndersellAlert from "@/components/UndersellAlert";

const mockReport = {
  date: "2025-05-10",
  duration: "12 min",
  role: "Senior Software Engineer",
  market: "NZ / APAC",
  overallScore: 7.4,
  prevScore: 6.9,
  questions: [
    {
      id: "q1",
      question: "Tell me about your career gap.",
      category: "gap_narrative",
      answer: "I took about 5 months off for maternity leave. I was just focused on my daughter, though I did keep up with some reading around AI tools.",
      scores: { clarity: 8, depth: 6, confidence: 5, relevance: 9 },
      feedback: "Your answer was clear and relevant, but watch for underselling — 'just focused' minimises what was a significant life event. Lead with the reality of what you were doing.",
      underselling_detected: true,
      underselling_phrases: ["just focused"],
      stronger_version: "I took five months of maternity leave to care for my daughter during her first months. During that time, I stayed curious — I followed developments in AI tooling and read around topics relevant to my next role. I'm returning energised and clear on where I want to go.",
      strength: "You gave a clear, chronological answer that stayed on topic.",
      improve: "Remove minimising language like 'just' — your experience deserves its full weight.",
    },
    {
      id: "q2",
      question: "Tell me about a time you led a team through a difficult situation.",
      category: "behavioural",
      answer: "When I was at Studio Burning Bush, I led a team of 4 engineers to deliver a live-stream auction feature under a tight deadline. We restructured the sprint, daily stand-ups kept us aligned, and we shipped on time. The CEO recognised the delivery with a $500 award.",
      scores: { clarity: 9, depth: 8, confidence: 9, relevance: 9 },
      feedback: "Excellent. Clear situation, specific outcome, and you quantified the recognition. This is exactly the energy to bring to every answer.",
      underselling_detected: false,
      underselling_phrases: [],
      stronger_version: "",
      strength: "You led with the outcome and backed it up with specifics — that's how strong answers are built.",
      improve: "Consider adding what you personally learned from the experience.",
    },
  ],
  topStrength: "You explained technical concepts clearly and with good depth.",
  mainImprovement: "Watch for self-qualifying language — you said 'just' 2 times in this session.",
  recommendedNext: "Gap narrative",
};

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = mockReport;
  const scoreDiff = report.overallScore - report.prevScore;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <Link href="/progress" className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#4A7C6F] mb-8 transition-colors">
        <ArrowLeft size={14} /> Back to Progress
      </Link>

      {/* Header */}
      <div className="bg-white border border-[#E5E0D8] rounded-2xl p-8 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-sm text-[#6B7280] mb-1">
              {new Date(report.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} · {report.duration} · {report.role} · {report.market}
            </p>
            <ConfidenceScore score={report.overallScore} size="lg" label="Overall score" />
          </div>
          <div className="flex items-center gap-1.5 text-sm font-medium">
            {scoreDiff >= 0 ? (
              <><TrendingUp size={16} className="text-[#10B981]" /><span className="text-[#10B981]">+{scoreDiff.toFixed(1)} vs last session</span></>
            ) : (
              <><TrendingDown size={16} className="text-amber-500" /><span className="text-amber-500">{scoreDiff.toFixed(1)} vs last session</span></>
            )}
          </div>
        </div>
      </div>

      {/* Per-question */}
      <h2 className="font-semibold text-[#1B4F72] mb-4">Question breakdown</h2>
      <div className="space-y-4 mb-8">
        {report.questions.map((q, i) => {
          const overall = Object.values(q.scores).reduce((a, b) => a + b, 0) / 4;
          return (
            <details key={q.id} className="group bg-white border border-[#E5E0D8] rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${q.category === "gap_narrative" ? "bg-[#E8F2EF] text-[#4A7C6F]" : "bg-purple-100 text-purple-700"}`}>
                    {q.category.replace("_", " ")}
                  </span>
                  <span className="text-sm font-medium text-[#1B4F72] line-clamp-1">{q.question}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-[#4A7C6F]">{overall.toFixed(1)}</span>
                  <ChevronDown size={16} className="text-[#6B7280] group-open:rotate-180 transition-transform" />
                </div>
              </summary>
              <div className="px-5 pb-5 space-y-4 border-t border-[#E5E0D8]">
                <p className="text-sm text-[#6B7280] italic pt-4">&ldquo;{q.answer}&rdquo;</p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {(["clarity", "depth", "confidence", "relevance"] as const).map((dim) => (
                    <div key={dim} className="bg-[#FAF8F4] rounded-lg p-2">
                      <p className="font-bold text-[#4A7C6F]">{q.scores[dim]}</p>
                      <p className="text-xs text-[#6B7280] capitalize">{dim}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-[#1B4F72] leading-relaxed">{q.feedback}</p>
                {q.underselling_detected && (
                  <UndersellAlert phrases={q.underselling_phrases} strongerVersion={q.stronger_version} />
                )}
                <div className="flex gap-4 text-sm">
                  <p><span className="text-[#10B981] font-medium">+</span> <span className="text-[#6B7280]">{q.strength}</span></p>
                </div>
                <p className="text-sm text-[#6B7280]">
                  <span className="font-medium text-[#1B4F72]">Next time: </span>{q.improve}
                </p>
              </div>
            </details>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-[#E8F2EF] border border-[#4A7C6F]/20 rounded-2xl p-7 space-y-4 mb-6">
        <h2 className="font-semibold text-[#1B4F72]">Summary</h2>
        <div>
          <p className="text-xs font-semibold text-[#4A7C6F] uppercase tracking-wide mb-1">Top strength</p>
          <p className="text-sm text-[#1B4F72]">{report.topStrength}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">Focus area</p>
          <p className="text-sm text-[#1B4F72]">{report.mainImprovement}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1">Recommended next session</p>
          <p className="text-sm text-[#1B4F72]">Focus: {report.recommendedNext}</p>
        </div>
      </div>

      {/* Shareable card */}
      <div className="bg-[#4A7C6F] rounded-2xl p-7 text-white text-center">
        <p className="font-serif text-lg font-bold mb-1">ReturnReady session complete</p>
        <p className="text-[#E8F2EF] text-sm mb-1">Score: {report.overallScore} · {report.role} · {new Date(report.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</p>
        <p className="text-[#E8F2EF]/70 text-xs mb-5">returnready.app</p>
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
