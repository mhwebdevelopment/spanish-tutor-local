"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, Edit3, ArrowLeft, Flag } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useStats } from "@/hooks/use-stats"
import { getCategoryIcon } from "@/lib/utils/category-icons"
import { INITIAL_PHRASES_DATA, MEXICAN_EXPRESSIONS, STORAGE_KEYS } from "@/lib/constants"
import type { VocabularyData } from "@/lib/types"

export default function PhrasesPage() {
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useLocalStorage(STORAGE_KEYS.THEME, false)
  const [phrasesData] = useLocalStorage<VocabularyData>(STORAGE_KEYS.PHRASES_DATA, INITIAL_PHRASES_DATA)
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

  const handleWordCheck = (wordId: string) => {
    toggleWordChecked(wordId)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header isDarkMode={isDarkMode} onToggleDarkModeAction={toggleDarkMode} />
        <Navigation />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Home className="h-6 w-6" />
              Daily Phrases
            </h2>
            <div className="flex flex-col gap-2 max-[430px]:items-start">
              <Button variant="outline" onClick={() => router.push("/manage")}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Phrases
              </Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </div>

          <Tabs defaultValue="Morning" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted">
              {Object.keys(phrasesData).map((routine) => {
                const IconComponent = getCategoryIcon(routine)
                return (
                  <TabsTrigger
                    key={routine}
                    value={routine}
                    className="data-[state=active]:bg-yellow-400 data-[state=active]:text-white dark:data-[state=active]:bg-yellow-600"
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {routine}
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {Object.keys(phrasesData).map((routine) => (
              <TabsContent key={routine} value={routine} className="space-y-3">
                {phrasesData[routine].English.map((_, index) => {
                  const wordId = `phrases_${routine}_${index}`
                  const isChecked = isWordChecked(wordId)

                  return (
                    <Card key={index} className="border-border">
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
                              className={`transition-colors ${isChecked ? "text-muted-foreground line-through" : "text-foreground"}`}
                            >
                              {phrasesData[routine].English[index]}
                            </div>
                          </div>
                          <div
                            className={`font-semibold transition-colors ${isChecked ? "text-muted-foreground line-through" : "text-yellow-700 dark:text-yellow-300"}`}
                          >
                            {phrasesData[routine].Spanish[index]}
                          </div>
                          <Badge
                            variant="secondary"
                            className={`justify-center font-mono text-xs ${isChecked ? "opacity-50" : ""}`}
                          >
                            {phrasesData[routine].Pronunciation[index]}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </TabsContent>
            ))}
          </Tabs>

          <Card className="bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 border-yellow-300 dark:border-yellow-700">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Flag className="h-5 w-5" />
                Mexican Expressions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {MEXICAN_EXPRESSIONS.English.map((_, index) => (
                <Card key={index} className="bg-card">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="font-medium text-foreground">{MEXICAN_EXPRESSIONS.English[index]}</div>
                      <div className="font-semibold text-yellow-700 dark:text-yellow-300">
                        {MEXICAN_EXPRESSIONS.Spanish[index]}
                      </div>
                      <div className="text-sm text-muted-foreground italic">{MEXICAN_EXPRESSIONS.Usage[index]}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
