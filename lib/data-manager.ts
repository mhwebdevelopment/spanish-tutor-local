import type { VocabularyCategory } from "./types"

export class DataManager {
  static saveToStorage(key: string, data: any): boolean {
    // Check if running in browser environment
    if (typeof window === 'undefined') {
      return false
    }
    
    try {
      localStorage.setItem(key, JSON.stringify(data))
      return true
    } catch (error) {
      // Only log errors in browser environment
      if (typeof window !== 'undefined') {
        console.error("Failed to save to localStorage:", error)
      }
      return false
    }
  }

  static loadFromStorage<T>(key: string, defaultValue: T): T {
    // Check if running in browser environment
    if (typeof window === 'undefined') {
      return defaultValue
    }
    
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : defaultValue
    } catch (error) {
      // Only log errors in browser environment
      if (typeof window !== 'undefined') {
        console.error("Failed to load from localStorage:", error)
      }
      return defaultValue
    }
  }

  static exportToCSV(data: VocabularyCategory, filename: string): void {
    // Check if running in browser environment
    if (typeof window === 'undefined') {
      return
    }
    
    let csvContent = "English,Spanish,Pronunciation\n"

    for (let i = 0; i < data.English.length; i++) {
      csvContent += `"${data.English[i] || ""}","${data.Spanish[i] || ""}","${data.Pronunciation[i] || ""}"\n`
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

  static parseCSV(csvText: string): VocabularyCategory {
    const lines = csvText.split("\n").filter((line) => line.trim())
    const result: VocabularyCategory = { English: [], Spanish: [], Pronunciation: [] }

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
