export interface QuestionData {
  question: string;
  questionHTML?: string;
  correct: string | number;
  wrong: (string | number)[];
  isLong?: boolean;
  optionsAreImages?: boolean;
  signature?: string;
}

export interface TopicData {
  id: string;
  category: string;
  title: string;
  desc: string;
  icon: string;
  generate: () => QuestionData;
}

export interface StatRecord {
  dogru: number;
  yanlis: number;
}

export interface GroupTopicStat {
  dogru: number;
  yanlis: number;
}

export interface GroupInfoStat {
  id: string;
  name: string;
  badge: string;
  color: string;
  dogru: number;
  yanlis: number;
  wins: number;
  topicStats: Record<string, GroupTopicStat>;
}

export type GroupStatsRecord = Record<string, GroupInfoStat>;

export type GradeStatsMap = Record<number, Record<string, StatRecord>>;
export type GradeGroupStatsMap = Record<number, GroupStatsRecord>;

export interface PlayerData {
  id: number;
  name: string;
  avatar: string;
  colorTheme: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    headerBg: string;
  };
  score: number;
  lives: number;
  streak: number;
  currentQuestionData: QuestionData | null;
  shuffledOptions: (string | number)[];
  selectedOption: (string | number) | null;
  feedbackState: 'none' | 'correct' | 'wrong';
  askedQuestions: string[];
  timeLeft?: number;
}
