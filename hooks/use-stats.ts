"use client"

import { useState } from "react"
import { StatsManager } from "@/lib/stats-manager"
import type { DailyStats } from "@/lib/types"

export function useStats() {
  const [stats, setStats] = useState<DailyStats>(() => StatsManager.getTodayStats())

  const refreshStats = () => {
    setStats(StatsManager.getTodayStats())
  }

  const addStars = (count: number) => {
    const newTotal = StatsManager.addStars(count)
    refreshStats()
    return newTotal
  }

  const addWords = (count: number) => {
    const newTotal = StatsManager.addWordsExplored(count)
    refreshStats()
    return newTotal
  }

  const addQuizGrade = (grade: string) => {
    StatsManager.addQuizGrade(grade)
    refreshStats()
  }

  const toggleWordChecked = (wordId: string) => {
    const isChecked = StatsManager.toggleWordChecked(wordId)
    refreshStats()
    return isChecked
  }

  const isWordChecked = (wordId: string) => {
    return StatsManager.isWordChecked(wordId)
  }

  return {
    stats,
    refreshStats,
    addStars,
    addWords,
    addQuizGrade,
    toggleWordChecked,
    isWordChecked,
  }
}
