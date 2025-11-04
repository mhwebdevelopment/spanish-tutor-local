import type { DailyStats } from "./types"
import { DataManager } from "./data-manager"
import { STORAGE_KEYS } from "./constants"
import { stringify } from "node:querystring"

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

  /**
   * Ensures checkedWords is always a proper Set instance
   * Handles conversion from array, object, or any other unexpected type
   */
  private static normalizeCheckedWords(checkedWords: any): Set<string> {
    // If it's already a Set, return it
    if (checkedWords instanceof Set) {
      return checkedWords
    }
    
    // If it's an array, convert to Set
    if (Array.isArray(checkedWords)) {
      return new Set(checkedWords)
    }
    
    // If it's an object with keys (legacy format or corruption), use keys
    if (checkedWords && typeof checkedWords === 'object') {
      return new Set(Object.keys(checkedWords))
    }
    
    // For any other case (null, undefined, string, number, etc.), return empty Set
    return new Set()
  }

  /**
   * Creates a default DailyStats object with proper types
   */
  private static createDefaultStats(): DailyStats {
    return {
      stars: 0,
      words: 0,
      grades: [],
      checkedWords: new Set()
    }
  }
  //  type DailyStats = {
  //    stars: number,
  //    words: number,
  //    grades: string[],
  //    checkedWords: Set<string>,
  //  }

  static getTodayStats(): DailyStats {
    const today = this.getTodayKey()
    // const allStats: Record<string, DailyStats> = {};
    const allStats = DataManager.loadFromStorage(STORAGE_KEYS.DAILY_STATS, {}) 
    
    // If it's a new day, initialize fresh stats but keep historical data
    if (this.isNewDay()) {
      this.markTodayAsActive()
      if (!allStats[today]) {
        allStats[today] = this.createDefaultStats()
        DataManager.saveToStorage(STORAGE_KEYS.DAILY_STATS, allStats)
      }
    }

    const rawStats = allStats[today] || this.createDefaultStats()
    
    // Ensure all properties exist and have correct types
    const stats: DailyStats = {
      stars: typeof rawStats.stars === 'number' ? rawStats.stars : 0,
      words: typeof rawStats.words === 'number' ? rawStats.words : 0,
      grades: Array.isArray(rawStats.grades) ? rawStats.grades : [],
      checkedWords: this.normalizeCheckedWords(rawStats.checkedWords)
    }

    return stats
  }

  private static saveTodayStats(stats: DailyStats): void {
    const today = this.getTodayKey()
    const allStats: Record<string, DailyStats> = {};
    // const allStats = DataManager.loadFromStorage(STORAGE_KEYS.DAILY_STATS, {})
    
    // Ensure checkedWords is normalized before saving
    const normalizedStats = {
      ...stats,
      checkedWords: Array.from(this.normalizeCheckedWords(stats.checkedWords))
    }
    
    allStats[today] = normalizedStats
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
    
    // No need for defensive checks here - getTodayStats() ensures proper types
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
    // getTodayStats() ensures checkedWords is always a Set
    return stats.checkedWords.has(wordId)
  }

  /**
   * Get historical stats for a specific date
   * Includes the same normalization as getTodayStats
   */
  static getStatsForDate(date: string): DailyStats {
    // const allStats: Record<string, DailyStats> = {};
    const allStats = DataManager.loadFromStorage(STORAGE_KEYS.DAILY_STATS, {})
    const rawStats = allStats[date] || this.createDefaultStats()
    
    const stats: DailyStats = {
      stars: typeof rawStats.stars === 'number' ? rawStats.stars : 0,
      words: typeof rawStats.words === 'number' ? rawStats.words : 0,
      grades: Array.isArray(rawStats.grades) ? rawStats.grades : [],
      checkedWords: this.normalizeCheckedWords(rawStats.checkedWords)
    }

    return stats
  }

  /**
   * Utility method to clean up corrupted data (optional)
   * Call this if you want to fix existing corrupted data
   */
  static repairCorruptedData(): void {
    // const allStats: Record<string, DailyStats> = {};
    const allStats = DataManager.loadFromStorage(STORAGE_KEYS.DAILY_STATS, {})
    let hasChanges = false
    
    for (const [date, stats] of Object.entries(allStats)) {
      const normalizedStats = {
        stars: typeof (stats as any).stars === 'number' ? (stats as any).stars : 0,
        words: typeof (stats as any).words === 'number' ? (stats as any).words : 0,
        grades: Array.isArray((stats as any).grades) ? (stats as any).grades : [],
        checkedWords: Array.from(this.normalizeCheckedWords((stats as any).checkedWords))
      }
      
      // Check if normalization made changes
      if (JSON.stringify(stats) !== JSON.stringify(normalizedStats)) {
        allStats[date] = normalizedStats
        hasChanges = true
      }
    }
    
    if (hasChanges) {
      DataManager.saveToStorage(STORAGE_KEYS.DAILY_STATS, allStats)
      console.log('Repaired corrupted stats data')
    }
  }
}