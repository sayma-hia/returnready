export const dailyTips = [
  "Gaps are common — 62% of professionals take at least one career break. You're in good company.",
  "Use the STAR method (Situation, Task, Action, Result) to structure behavioural answers.",
  "Your gap narrative should be 30 seconds long and end with energy — not apology.",
  "Interviewers remember how you made them feel, not every answer. Project calm confidence.",
  "Practise out loud. Reading your answers feels very different from saying them.",
  "If you say 'just' or 'only' when describing your experience, pause and remove it.",
  "Your maternity leave, caring responsibilities, or recovery made you more resilient. That's real.",
  "Start with your strongest points. Don't bury the lead.",
  "A 'tell me about yourself' answer should be 90 seconds, structured, and end on your next chapter.",
  "It's okay to ask for a moment to think before answering a hard question.",
  "NZ/APAC interviews often focus on culture fit — show curiosity and collaboration.",
  "UK competency-based interviews love specific examples. Have 5-6 strong stories ready.",
  "US interviews reward quantified impact — know your numbers.",
];

export function getTipOfTheDay(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return dailyTips[dayOfYear % dailyTips.length];
}

export const gapTypeLabels: Record<string, string> = {
  maternity: "Maternity / parental leave",
  caring: "Caring for a family member",
  burnout: "Health or burnout recovery",
  retraining: "Career retraining",
  other: "Other",
};

export const marketLabels: Record<string, string> = {
  nz_apac: "New Zealand / APAC",
  uk: "United Kingdom",
  us: "United States",
  south_asia: "South Asia",
  other: "Other",
};

export const seniorityLabels: Record<string, string> = {
  junior: "Junior",
  mid: "Mid-level",
  senior: "Senior",
  lead: "Lead / Principal",
};

export const difficultyLabels: Record<string, string> = {
  gentle: "Gentle start",
  building: "Building confidence",
  full: "Full interview pace",
};

export const marketStyles: Record<string, string> = {
  nz_apac: "Collaborative, values-focused, flat culture",
  uk: "Structured, competency-based",
  us: "STAR heavy, achievement metrics",
  south_asia: "Technical depth, problem-solving",
  other: "Balanced approach",
};

export const milestones = [
  { id: "first_session", label: "First session", description: "Completed your first practice session" },
  { id: "five_sessions", label: "5 sessions", description: "Completed 5 practice sessions" },
  { id: "narrative_built", label: "Narrative built", description: "Built your gap narrative" },
  { id: "confidence_8", label: "Confidence 8+", description: "Achieved a confidence score of 8 or above" },
];
