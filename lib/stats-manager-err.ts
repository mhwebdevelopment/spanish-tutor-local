import type { DailyStats } from "./types"
import { DataManager } from "./data-manager"
import { STORAGE_KEYS } from "./constants"

export class StatsManager {
  private static getTodayKey(): string {
    return new Date().toISOString().split("T")[0] // YYYY-MM-DD
  }

  private static isNewDay(): boolean {
    const lastActiveDate = DataManager.loadFromStorage("lastActiveDate", null)
    const today = this.getTodayKey()
    return lastActiveDate !== today
  }

  private static markTodayAsActive(): void {
    const today = this.getTodayKey()
    DataManager.saveToStorage("lastActiveDate", today)
  }

  static getTodayStats(): DailyStats {
    const today = this.getTodayKey()
    const allStats = DataManager.loadFromStorage(STORAGE_KEYS.DAILY_STATS, {})

    // If it's a new day, initialize fresh stats but keep historical data
    if (this.isNewDay()) {
      this.markTodayAsActive()
      if (!allStats[today]) {
        allStats[today] = { stars: 0, words: 0, grades: [], checkedWords: new Set() }
        DataManager.saveToStorage(STORAGE_KEYS.DAILY_STATS, allStats)
      }
    }

    const stats = allStats[today] || { stars: 0, words: 0, grades: [], checkedWords: new Set() }

    // Convert array back to Set if needed
    if (Array.isArray(stats.checkedWords)) {
      stats.checkedWords = new Set(stats.checkedWords)
    }

    return stats
  }

  private static saveTodayStats(stats: DailyStats): void {
    const today = this.getTodayKey()
    const allStats = DataManager.loadFromStorage(STORAGE_KEYS.DAILY_STATS, {})
    allStats[today] = {
      ...stats,
      checkedWords: Array.from(stats.checkedWords), // Convert Set to Array for storage
    }
    DataManager.saveToStorage(STORAGE_KEYS.DAILY_STATS, allStats)
    this.markTodayAsActive()
  }

  static addWordsExplored(count: number): number {
    const stats = this.getTodayStats()
    stats.words += count
    this.saveTodayStats(stats)
    return stats.words
  }

  static addStars(count: number): number {
    const stats = this.getTodayStats()
    stats.stars += count
    this.saveTodayStats(stats)
    return stats.stars
  }

  static addQuizGrade(grade: string): void {
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

  // Get historical stats for a specific date
  static getStatsForDate(date: string): DailyStats {
    const allStats = DataManager.loadFromStorage(STORAGE_KEYS.DAILY_STATS, {})
    const stats = allStats[date] || { stars: 0, words: 0, grades: [], checkedWords: new Set() }

    if (Array.isArray(stats.checkedWords)) {
      stats.checkedWords = new Set(stats.checkedWords)
    }

    return stats
  }
}
