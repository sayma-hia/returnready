export type GapType = "maternity" | "caring" | "burnout" | "retraining" | "other";
export type Seniority = "junior" | "mid" | "senior" | "lead";
export type Market = "nz_apac" | "uk" | "us" | "south_asia" | "other";
export type Difficulty = "gentle" | "building" | "full";
export type SessionType = "full" | "quick" | "narrative";
export type QuestionCategory = "technical" | "behavioural" | "gap_narrative" | "culture";

export type UserProfile = {
  id: string;
  userId: string;
  gapType: GapType;
  gapStart: string;
  gapEnd: string | null;
  targetRole: string;
  seniority: Seniority;
  targetMarket: Market;
  confidenceBaseline: number;
  narrativeBrief: string | null;
  narrativeFull: string | null;
  narrativePivot: string | null;
};

export type Question = {
  question: string;
  category: QuestionCategory;
  hint: string;
};

export type AnswerScore = {
  clarity: number;
  depth: number;
  confidence: number;
  relevance: number;
};

export type AnswerEvaluation = {
  scores: AnswerScore;
  overall: number;
  feedback: string;
  underselling_detected: boolean;
  underselling_phrases: string[];
  stronger_version: string;
  strength: string;
  improve: string;
};

export type SessionAnswer = {
  id: string;
  sessionId: string;
  questionText: string;
  questionCategory: QuestionCategory;
  answerText: string;
  scoreClarity: number;
  scoreDepth: number;
  scoreConfidence: number;
  scoreRelevance: number;
  feedback: string;
  underselling_detected: boolean;
  underselling_phrases: string[];
  stronger_version: string;
};

export type Session = {
  id: string;
  userId: string;
  sessionType: SessionType;
  focusAreas: string[];
  difficulty: Difficulty;
  marketStyle: Market;
  overallScore: number;
  confidenceScore: number;
  undersellingCount: number;
  completedAt: string;
  answers?: SessionAnswer[];
};

export type NarrativeResult = {
  brief: string;
  full: string;
  pivot_forward: string;
  coaching_note: string;
};

export type OnboardingData = {
  gapType: GapType | null;
  gapStart: string;
  gapEnd: string;
  stillOnBreak: boolean;
  gapDescription: string;
  targetRole: string;
  seniority: Seniority | null;
  targetMarket: Market | null;
  timeUntilInterviews: string;
  confidenceLevel: number;
};
