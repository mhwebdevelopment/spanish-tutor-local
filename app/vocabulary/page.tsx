"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Edit3, ArrowLeft } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useStats } from "@/hooks/use-stats"
import { getCategoryIcon, formatCategoryName } from "@/lib/utils/category-icons"
import { INITIAL_VOCABULARY_DATA, STORAGE_KEYS } from "@/lib/constants"
import type { VocabularyData } from "@/lib/types"

export default function VocabularyPage() {
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useLocalStorage(STORAGE_KEYS.THEME, false)
  const [vocabularyData] = useLocalStorage<VocabularyData>(STORAGE_KEYS.VOCAB_DATA, INITIAL_VOCABULARY_DATA)
  const [currentCategory, setCurrentCategory] = useState<string | null>(null)
  const { toggleWordChecked, isWordChecked } = useStats()

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

  const handleWordCheck = (wordId: string) => {
    toggleWordChecked(wordId)
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
              <h2 className="text-2xl font-bold text-foreground">{friendlyName}</h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentCategory(null)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Categories
                </Button>
                <Button variant="outline" onClick={() => router.push("/manage")}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Vocab
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {categoryData.English.map((_, index) => {
                const wordId = `${currentCategory}_${index}`
                const isChecked = isWordChecked(wordId)

                return (
                  <Card key={index} className="border-border hover:border-yellow-400 transition-colors">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleWordCheck(wordId)}
                            className="w-4 h-4 text-yellow-600 bg-background border-border rounded focus:ring-yellow-500 focus:ring-2"
                          />
                          <div
                            className={`font-medium transition-colors ${isChecked ? "text-muted-foreground line-through" : "text-foreground"}`}
                          >
                            {categoryData.English[index]}
                          </div>
                        </div>
                        <div
                          className={`font-semibold text-lg transition-colors ${isChecked ? "text-muted-foreground line-through" : "text-yellow-700 dark:text-yellow-300"}`}
                        >
                          {categoryData.Spanish[index]}
                        </div>
                        <Badge
                          variant="secondary"
                          className={`justify-center font-mono text-xs ${isChecked ? "opacity-50" : ""}`}
                        >
                          {categoryData.Pronunciation[index]}
                        </Badge>
                      </div>
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header isDarkMode={isDarkMode} onToggleDarkModeAction={toggleDarkMode} />
        <Navigation />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              Learn Vocabulary
            </h2>
            <div className="flex flex-col gap-2 max-[430px]:items-start">
              <Button variant="outline" onClick={() => router.push("/manage")}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Vocab
              </Button>
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
