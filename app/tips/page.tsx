"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, ArrowLeft } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useStats } from "@/hooks/use-stats"
import { PARENT_TIPS, STORAGE_KEYS } from "@/lib/constants"

export default function TipsPage() {
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useLocalStorage(STORAGE_KEYS.THEME, false)
  const { stats } = useStats()

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header isDarkMode={isDarkMode} onToggleDarkModeAction={toggleDarkMode} />
        <Navigation />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Users className="h-6 w-6" />
              Parent Tips
            </h2>
            <Button variant="outline" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>

          <div className="grid gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Implementation Strategies</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {PARENT_TIPS.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-400 dark:bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Always Remember</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Language learning is a journey, not a destination. Every word your family learns together brings you
                  closer to fluency. ¡Sigue adelante! (Keep going!)
                </p>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">{stats.words}</div>
                  <div className="text-sm text-muted-foreground">Words Explored Today</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-white">
              <CardHeader>
                <CardTitle className="text-foreground">Easy Practice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted dark:bg-gray-800 rounded-lg border">
                    <h4 className="font-semibold text-foreground mb-2">🎵 Music & Songs</h4>
                    <p className="text-sm text-muted-foreground">
                      Use Spanish children's songs during daily activities. Music helps with pronunciation and memory.
                    </p>
                  </div>
                  <div className="p-4 bg-muted dark:bg-gray-800 rounded-lg border">
                    <h4 className="font-semibold text-foreground mb-2">🍳 Cooking Together</h4>
                    <p className="text-sm text-muted-foreground">
                      Cook dishes from different countries while practicing vocabulary. Hands-on experience helps!
                    </p>
                  </div>
                  <div className="p-4 bg-muted dark:bg-gray-800 rounded-lg border">
                    <h4 className="font-semibold text-foreground mb-2">📖 Story Time</h4>
                    <p className="text-sm text-muted-foreground">
                      Read simple Spanish picture books together. Start with familiar stories translated to Spanish.
                    </p>
                  </div>
                  <div className="p-4 bg-muted dark:bg-gray-800 rounded-lg border">
                    <h4 className="font-semibold text-foreground mb-2">🎮 Games & Play</h4>
                    <p className="text-sm text-muted-foreground">
                      Turn learning into games: Spanish Simon Says, color hunts, or counting games.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-white">
              <CardHeader>
                <CardTitle className="text-foreground">Success Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div className="p-4">
                    <div className="text-2xl mb-2">🌱</div>
                    <h4 className="font-semibold text-foreground">Week 1-2</h4>
                    <p className="text-sm text-muted-foreground">Basic greetings and family words</p>
                  </div>
                  <div className="p-4">
                    <div className="text-2xl mb-2">🌿</div>
                    <h4 className="font-semibold text-foreground">Month 1</h4>
                    <p className="text-sm text-muted-foreground">30+ words, simple phrases</p>
                  </div>
                  <div className="p-4">
                    <div className="text-2xl mb-2">🌳</div>
                    <h4 className="font-semibold text-foreground">Month 3</h4>
                    <p className="text-sm text-muted-foreground">Daily conversations in Spanish</p>
                  </div>
                  <div className="p-4">
                    <div className="text-2xl mb-2">🏆</div>
                    <h4 className="font-semibold text-foreground">Month 6</h4>
                    <p className="text-sm text-muted-foreground">Confident family communication</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
