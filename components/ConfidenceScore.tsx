type Props = {
  score: number;
  size?: "sm" | "lg";
  label?: string;
};

export default function ConfidenceScore({ score, size = "sm", label = "Overall" }: Props) {
  const color =
    score >= 8 ? "text-[#10B981]" : score >= 6 ? "text-[#4A7C6F]" : "text-[#F59E0B]";

  if (size === "lg") {
    return (
      <div className="text-center">
        <p className={`text-6xl font-bold font-serif ${color}`}>{score.toFixed(1)}</p>
        <p className="text-[#6B7280] text-sm mt-1">{label} · out of 10</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`font-bold text-lg ${color}`}>{score.toFixed(1)}</span>
      <span className="text-[#6B7280] text-sm">/ 10 · {label}</span>
    </div>
  );
}
