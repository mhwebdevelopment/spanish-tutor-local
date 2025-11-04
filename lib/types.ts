export interface VocabularyCategory {
  English: string[]
  Spanish: string[]
  Pronunciation: string[]
}

export interface VocabularyData {
  [key: string]: VocabularyCategory
}

export interface PhrasesCategory {
  English: string[]
  Spanish: string[]
  Pronunciation: string[]
}

export interface PhrasesData {
  [key: string]: PhrasesCategory
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface DailyStats {
  stars: number
  words: number
  grades: string[]
  checkedWords: Set<string> | string[]
}

export interface QuizQuestion {
  question: string
  correct: string
  category: string
  options?: string[]
}

export interface FlashCard {
  id: string
  type: "vocabulary" | "phrases"
  category: string
  english: string
  spanish: string
  pronunciation: string
}

export interface TableRow {
  english: string
  spanish: string
  pronunciation: string
}

export type SaveStatus = "idle" | "saving" | "saved" | "error"
export type EditMode = "vocabulary" | "phrases"
export type Section = "welcome" | "vocabulary" | "phrases" | "quiz" | "cards" | "chat" | "tips" | "manage"
