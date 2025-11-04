"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Card,CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useStats } from "@/hooks/use-stats"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { getCategoryIcon, formatCategoryName } from "@/lib/utils/category-icons"
import { INITIAL_PHRASES_DATA, INITIAL_VOCABULARY_DATA, STORAGE_KEYS } from "@/lib/constants"
import type { VocabularyData } from "@/lib/types"
import type { PhrasesData } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  BookOpen, 
  Edit3, 
  ArrowLeft,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Plus,
  Star,
  Save,
  Home,
  Trash2,
  Flag, } from "lucide-react"

// Data management utilities
class DataManager {
  //private static STORAGE_KEY = "spanishLearningData"
  static VOCAB_KEY = "vocabularyData"
  static PHRASES_KEY = "phrasesData"

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
    return allStats[today] || { stars: 0, words: 0, grades: [], checkedWords: new Set() }
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

export default function ManagerPage() {
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useLocalStorage(STORAGE_KEYS.THEME, false)
  const [vocabularyData, setVocabularyData] = useLocalStorage<VocabularyData>(STORAGE_KEYS.VOCAB_DATA, INITIAL_VOCABULARY_DATA)
  const [phrasesData, setPhrasesData] = useLocalStorage<PhrasesData>(STORAGE_KEYS.PHRASES_DATA, INITIAL_PHRASES_DATA)
  const [currentCategory, setCurrentCategory] = useState<string | null>(null)
  
  //manage vocab state
  // Manage vocab state
  const [editMode, setEditMode] = useState<"vocabulary" | "phrases">("vocabulary")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [tableData, setTableData] = useState<Array<{ english: string; spanish: string; pronunciation: string }>>([])
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")



  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const showCategoryDetail = (category: string) => {
    setCurrentCategory(category)
  }


  if (currentCategory) {
    const categoryData = vocabularyData[currentCategory]
    const friendlyName = formatCategoryName(currentCategory)

    

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header isDarkMode={isDarkMode} onToggleDarkModeAction={toggleDarkMode} />
        <Navigation />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              Manage Vocabulary
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push("/")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.keys(vocabularyData).map((category) => {
              const IconComponent = getCategoryIcon(category)
              const friendlyName = formatCategoryName(category)
              const wordCount = vocabularyData[category].English.length

              return (
                <Card
                  key={category}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border-border hover:border-yellow-400 bg-card"
                  onClick={() => showCategoryDetail(category)}
                >
                  <CardContent className="p-6 text-center">
                    <IconComponent className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                    <h3 className="font-semibold text-foreground mb-2">{friendlyName}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {vocabularyData[category].Spanish.slice(0, 3).join(", ")}...
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {wordCount} words
                    </Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

  // Enhanced vocabulary management functions
  const populateTableData = (category: string) => {
    if (!category) return

    let data
    if (editMode === "vocabulary") {
      data = vocabularyData[category as keyof typeof vocabularyData]
    } else {
      data = phrasesData[category as keyof typeof phrasesData]
    }

    if (!data) return

    const newTableData = []
    for (let i = 0; i < data.English.length; i++) {
      newTableData.push({
        english: data.English[i] || "",
        spanish: data.Spanish[i] || "",
        pronunciation: data.Pronunciation[i] || "",
      })
    }
    setTableData(newTableData)
  }

  const addRow = () => {
    setTableData((prev) => [...prev, { english: "", spanish: "", pronunciation: "" }])
  }

  const updateRow = (index: number, field: "english" | "spanish" | "pronunciation", value: string) => {
    setTableData((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)))
  }

  const deleteRow = (index: number) => {
    setTableData((prev) => prev.filter((_, i) => i !== index))
  }

  const saveData = async () => {
    if (!selectedCategory) return

    setSaveStatus("saving")

    try {
      // Filter out empty rows
      const filteredData = tableData.filter((row) => row.english.trim() || row.spanish.trim())

      const english = filteredData.map((row) => row.english.trim())
      const spanish = filteredData.map((row) => row.spanish.trim())
      const pronunciation = filteredData.map((row) => row.pronunciation.trim())

      const newData = { English: english, Spanish: spanish, Pronunciation: pronunciation }

      if (editMode === "vocabulary") {
        const updatedVocabulary = { ...vocabularyData, [selectedCategory]: newData }
        setVocabularyData(updatedVocabulary)
        DataManager.saveToStorage(DataManager.VOCAB_KEY, updatedVocabulary)
      } else {
        const updatedPhrases = { ...phrasesData, [selectedCategory]: newData }
        setPhrasesData(updatedPhrases)
        DataManager.saveToStorage(DataManager.PHRASES_KEY, updatedPhrases)
      }

      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (error) {
      console.error("Save failed:", error)
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    }
  }

  const exportToCSV = () => {
    if (!selectedCategory) return

    const data =
      editMode === "vocabulary"
        ? vocabularyData[selectedCategory as keyof typeof vocabularyData]
        : phrasesData[selectedCategory as keyof typeof phrasesData]

    const filename = `${editMode}_${selectedCategory}_${new Date().toISOString().split("T")[0]}.csv`
    DataManager.exportToCSV(data, filename)
  }

  const importFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !selectedCategory) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string
        const parsedData = DataManager.parseCSV(csv)

        if (parsedData.English.length > 0) {
          if (editMode === "vocabulary") {
            const updatedVocabulary = { ...vocabularyData, [selectedCategory]: parsedData }
            setVocabularyData(updatedVocabulary)
            DataManager.saveToStorage(DataManager.VOCAB_KEY, updatedVocabulary)
          } else {
            const updatedPhrases = { ...phrasesData, [selectedCategory]: parsedData }
            setPhrasesData(updatedPhrases)
            DataManager.saveToStorage(DataManager.PHRASES_KEY, updatedPhrases)
          }

          populateTableData(selectedCategory)
          setSaveStatus("saved")
          setTimeout(() => setSaveStatus("idle"), 2000)
        }
      } catch (error) {
        console.error("Import failed:", error)
        setSaveStatus("error")
        setTimeout(() => setSaveStatus("idle"), 3000)
      }
    }
    reader.readAsText(file)
    event.target.value = ""
  }

  const getAvailableCategories = () => {
    return editMode === "vocabulary" ? Object.keys(vocabularyData) : Object.keys(phrasesData)
  }


const renderManageVocabSection = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <Edit3 className="h-6 w-6" />
        Manage Content
      </h2>
    </div>

    {/* Save Status Alert */}
    {saveStatus !== "idle" && (
      <Alert
        className={
          saveStatus === "error" ? "border-red-500" : "border-green-500"
        }
      >
        {saveStatus === "saving" && <AlertCircle className="h-4 w-4" />}
        {saveStatus === "saved" && <CheckCircle className="h-4 w-4" />}
        {saveStatus === "error" && <AlertCircle className="h-4 w-4" />}
        <AlertDescription>
          {saveStatus === "saving" && "Saving changes..."}
          {saveStatus === "saved" && "Changes saved successfully!"}
          {saveStatus === "error" &&
            "Failed to save changes. Please try again."}
        </AlertDescription>
      </Alert>
    )}

    <Card className="border-border">
      <CardHeader>
        <div className="flex flex-wrap gap-4 items-center">
          {/* Content Type Toggle */}
          <div className="flex gap-2">
            <Button
              variant={editMode === "vocabulary" ? "default" : "outline"}
              className={
                editMode === "vocabulary"
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                  : ""
              }
              onClick={() => {
                setEditMode("vocabulary");
                setSelectedCategory("");
                setTableData([]);
              }}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Vocabulary
            </Button>
            <Button
              variant={editMode === "phrases" ? "default" : "outline"}
              className={
                editMode === "phrases"
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                  : ""
              }
              onClick={() => {
                setEditMode("phrases");
                setSelectedCategory("");
                setTableData([]);
              }}
            >
              <Home className="h-4 w-4 mr-2" />
              Phrases
            </Button>
          </div>

          {/* Category Selection */}
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value);
              populateTableData(value);
            }}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder={`Select ${editMode} category`} />
            </SelectTrigger>
            <SelectContent>
              {getAvailableCategories().map((category) => (
                <SelectItem key={category} value={category}>
                  {category
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 max-[430px]:flex-col max-[430px]:items-start">
            <div className="flex gap-2 max-[430px]:flex-col max-[430px]:w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={addRow}
                disabled={!selectedCategory}
                className="max-[430px]:w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Row
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!selectedCategory}
                asChild
                className="max-[430px]:w-full"
              >
                <label htmlFor="csv-import" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Import CSV
                </label>
              </Button>
              <input
                id="csv-import"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={importFromCSV}
              />
            </div>
            <div className="flex gap-2 max-[430px]:flex-col max-[430px]:w-full">
              <Button
                size="sm"
                className="bg-yellow-500 hover:bg-yellow-600 text-white max-[430px]:w-full"
                onClick={saveData}
                disabled={!selectedCategory || saveStatus === "saving"}
              >
                <Save className="h-4 w-4 mr-2" />
                {saveStatus === "saving" ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                disabled={!selectedCategory}
                className="max-[430px]:w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      {selectedCategory && (
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead>English</TableHead>
                  <TableHead>Spanish</TableHead>
                  <TableHead>Pronunciation</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={row.english}
                        onChange={(e) =>
                          updateRow(index, "english", e.target.value)
                        }
                        placeholder="English word/phrase"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.spanish}
                        onChange={(e) =>
                          updateRow(index, "spanish", e.target.value)
                        }
                        placeholder="Spanish word/phrase"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.pronunciation}
                        onChange={(e) =>
                          updateRow(index, "pronunciation", e.target.value)
                        }
                        placeholder="Pronunciation guide"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRow(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {tableData.length === 0 && selectedCategory && (
            <div className="text-center py-8 text-muted-foreground">
              No entries found. Click "Add Row" to start adding content.
            </div>
          )}
        </CardContent>
      )}
    </Card>
  </div>
);

  // Default return for when currentCategory is null (initial state)
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header isDarkMode={isDarkMode} onToggleDarkModeAction={toggleDarkMode} />
        <Navigation />
        
        <div className="space-y-6">
          {renderManageVocabSection()}
        </div>
      </div>
    </div>
  )
}

