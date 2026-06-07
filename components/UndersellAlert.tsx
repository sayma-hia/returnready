import { AlertTriangle } from "lucide-react";

type Props = {
  phrases: string[];
  strongerVersion?: string;
};

export default function UndersellAlert({ phrases, strongerVersion }: Props) {
  if (phrases.length === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
      <div className="flex items-start gap-2">
        <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-amber-800 text-sm">Underselling detected</p>
          <p className="text-amber-700 text-sm mt-1">
            Watch for these phrases that quietly shrink your impact:
          </p>
          <ul className="mt-2 space-y-1">
            {phrases.map((phrase, i) => (
              <li key={i} className="text-sm text-amber-800 font-medium">
                &ldquo;{phrase}&rdquo;
              </li>
            ))}
          </ul>
        </div>
      </div>
      {strongerVersion && (
        <div className="border-t border-amber-200 pt-3">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">
            Stronger version
          </p>
          <p className="text-sm text-amber-900 leading-relaxed">{strongerVersion}</p>
        </div>
      )}
    </div>
  );
}
