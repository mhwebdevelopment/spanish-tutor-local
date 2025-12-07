"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Flag } from "lucide-react"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { TodaysProgress } from "@/components/todays-progress"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useStats } from "@/hooks/use-stats"
import { INITIAL_VOCABULARY_DATA, INITIAL_PHRASES_DATA } from "@/lib/constants"
import type { VocabularyData } from "@/lib/types"

// Data management utilities
class DataManager {
  private static STORAGE_KEY = "spanishLearningData"
  private static VOCAB_KEY = "vocabularyData"
  private static PHRASES_KEY = "phrasesData"

  static saveToStorage(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data))
      return true
    } catch (error) {
      console.error("Failed to save to localStorage:", error)
      return false
    }
  }

  static loadFromStorage(key: string, defaultValue: any = null) {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : defaultValue
    } catch (error) {
      console.error("Failed to load from localStorage:", error)
      return defaultValue
    }
  }

  static exportToCSV(data: any, filename: string) {
    let csvContent = ""

    if (data.English && data.Spanish && data.Pronunciation) {
      // Vocabulary format
      csvContent = "English,Spanish,Pronunciation\n"
      for (let i = 0; i < data.English.length; i++) {
        csvContent += `"${data.English[i] || ""}","${data.Spanish[i] || ""}","${data.Pronunciation[i] || ""}"\n`
      }
    } else {
      // Phrases format
      csvContent = "English,Spanish,Pronunciation\n"
      for (let i = 0; i < data.English.length; i++) {
        csvContent += `"${data.English[i] || ""}","${data.Spanish[i] || ""}","${data.Pronunciation[i] || ""}"\n`
      }
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  static parseCSV(csvText: string): { English: string[]; Spanish: string[]; Pronunciation: string[] } {
    const lines = csvText.split("\n").filter((line) => line.trim())
    const result = { English: [] as string[], Spanish: [] as string[], Pronunciation: [] as string[] }

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      // Parse CSV with proper quote handling
      const matches = line.match(/("(?:[^"\\]|\\.)*"|[^",]*)/g)
      if (matches && matches.length >= 2) {
        result.English.push(matches[0].replace(/^"|"$/g, "").replace(/""/g, '"'))
        result.Spanish.push(matches[1].replace(/^"|"$/g, "").replace(/""/g, '"'))
        result.Pronunciation.push(matches[2] ? matches[2].replace(/^"|"$/g, "").replace(/""/g, '"') : "")
      }
    }

    return result
  }
}

// Add after the DataManager class
class StatsManager {
  private static STATS_KEY = "dailyStats"

  static getTodayKey(): string {
    return new Date().toISOString().split("T")[0] // YYYY-MM-DD
  }

  static getTodayStats() {
    const today = this.getTodayKey()
    const allStats = DataManager.loadFromStorage(this.STATS_KEY, {})
    return allStats[today] || { stars: [], words: 0, grades: [], checkedWords: new Set() }
  }

  static saveTodayStats(stats: any) {
    const today = this.getTodayKey()
    const allStats = DataManager.loadFromStorage(this.STATS_KEY, {})
    allStats[today] = {
      ...stats,
      checkedWords: Array.from(stats.checkedWords), // Convert Set to Array for storage
    }
    DataManager.saveToStorage(this.STATS_KEY, allStats)
  }

  static addWordsExplored(count: number) {
    const stats = this.getTodayStats()
    stats.words += count
    this.saveTodayStats(stats)
    return stats.words
  }

  static addStars(count: number) {
    const stats = this.getTodayStats()
    stats.stars += count
    this.saveTodayStats(stats)
    return stats.stars
  }

  static addQuizGrade(grade: string) {
    const stats = this.getTodayStats()
    stats.grades.push(grade)
    this.saveTodayStats(stats)
  }

  static toggleWordChecked(wordId: string): boolean {
    const stats = this.getTodayStats()
    if (!stats.checkedWords) stats.checkedWords = new Set()
    else if (Array.isArray(stats.checkedWords)) stats.checkedWords = new Set(stats.checkedWords)

    const wasChecked = stats.checkedWords.has(wordId)
    if (wasChecked) {
      stats.checkedWords.delete(wordId)
      stats.words = Math.max(0, stats.words - 1)
    } else {
      stats.checkedWords.add(wordId)
      stats.words += 1
    }

    this.saveTodayStats(stats)
    return !wasChecked
  }

  static isWordChecked(wordId: string): boolean {
    const stats = this.getTodayStats()
    if (!stats.checkedWords) return false
    if (Array.isArray(stats.checkedWords)) stats.checkedWords = new Set(stats.checkedWords)
    return stats.checkedWords.has(wordId)
  }
}

// Chat message interface
interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useLocalStorage("theme", false)
  const [vocabularyData] = useLocalStorage<VocabularyData>("vocabularyData", INITIAL_VOCABULARY_DATA)
  const [phrasesData] = useLocalStorage<VocabularyData>("phrasesData", INITIAL_PHRASES_DATA)
  const { stats } = useStats()
  const [dailyWord, setDailyWord] = useState({
    spanish: "Familia",
    english: "Family",
    pronunciation: "fah-MEE-lee-ah",
  })

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  // Update daily word when vocabulary changes
  useEffect(() => {
    const allWords: any[] = []
    Object.keys(vocabularyData).forEach((category) => {
      const categoryData = vocabularyData[category]
      for (let i = 0; i < categoryData.English.length; i++) {
        allWords.push({
          english: categoryData.English[i],
          spanish: categoryData.Spanish[i],
          pronunciation: categoryData.Pronunciation[i],
        })
      }
    })

    if (allWords.length > 0) {
      const today = new Date()
      const dayOfYear = Math.floor(
        (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24,
      )
      const wordIndex = dayOfYear % allWords.length
      setDailyWord(allWords[wordIndex])
    }
  }, [vocabularyData])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Header isDarkMode={isDarkMode} onToggleDarkModeAction={toggleDarkMode} />
        <Navigation />

        <div className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader className="text-center pb-4">
              <p className="text-muted-foreground text-sm">
                Get the whole family speaking by incorporating natural daily vocab. <br/> Find & save new translations, have natural conversations, & get grammar help using local LLMs!
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-xl font-bold text-foreground">
                    {Object.values(vocabularyData).reduce((total, cat) => total + cat.English.length, 0)}+
                  </div>
                  <div className="text-xs text-muted-foreground">Essential Words</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-xl font-bold text-foreground">
                   {Object.values(phrasesData).reduce((total, cat) => total + cat.English.length, 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">Daily Phrases</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-xl font-bold text-foreground">
                    {Object.keys(vocabularyData).length + Object.keys(phrasesData).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Categories</div>
                </div>
              </div>

              {/* Today's Progress Component with Title */}
              <TodaysProgress showTitle={true} className="mb-4" />

              {/* Compact Daily Word Card */}
              <Card className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
                <CardContent className="p-3">
                  <div className="text-center">
                    <h3 className="text-base font-semibold mb-2">Word of the Day</h3>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-3">
                      <div className="text-xl font-bold">{dailyWord.spanish}</div>
                      <div className="text-base opacity-90">{dailyWord.english}</div>
                      <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                        {dailyWord.pronunciation}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center">
            <Badge
              variant="outline"
              className="border-yellow-400 text-yellow-700 dark:text-yellow-300 dark:border-yellow-600 px-4 py-2"
            >
              <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
              {stats.stars} stars earned today!
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
