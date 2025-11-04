"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { TodaysProgress } from "@/components/todays-progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Target, ArrowLeft } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useStats } from "@/hooks/use-stats"
import { INITIAL_VOCABULARY_DATA, INITIAL_PHRASES_DATA, STORAGE_KEYS } from "@/lib/constants"
import type { VocabularyData, QuizQuestion, FlashCard } from "@/lib/types"

export default function QuizPage() {
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useLocalStorage(STORAGE_KEYS.THEME, false)
  const [vocabularyData] = useLocalStorage<VocabularyData>(STORAGE_KEYS.VOCAB_DATA, INITIAL_VOCABULARY_DATA)
  const [phrasesData] = useLocalStorage<VocabularyData>(STORAGE_KEYS.PHRASES_DATA, INITIAL_PHRASES_DATA)
  const { stats, addStars, addWords, addQuizGrade } = useStats()

  // Quiz state
  const [quizData, setQuizData] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [showQuizGame, setShowQuizGame] = useState(false)
  const [showQuizResults, setShowQuizResults] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  // Flashcard state
  const [flashcards, setFlashcards] = useState<FlashCard[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isCardFlipped, setIsCardFlipped] = useState(false)
  const [sessionCorrect, setSessionCorrect] = useState<FlashCard[]>([])
  const [sessionIncorrect, setSessionIncorrect] = useState<FlashCard[]>([])
  const [showCardResults, setShowCardResults] = useState(false)
  const [cardSessionActive, setCardSessionActive] = useState(false)

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

  const startQuiz = (type: "vocabulary" | "phrases") => {
    const newQuizData: QuizQuestion[] = []

    if (type === "vocabulary") {
      Object.keys(vocabularyData).forEach((category) => {
        const categoryData = vocabularyData[category]
        for (let i = 0; i < categoryData.English.length; i++) {
          newQuizData.push({
            question: `What does "${categoryData.Spanish[i]}" mean?`,
            correct: categoryData.English[i],
            category: category,
          })
        }
      })
    } else {
      Object.keys(phrasesData).forEach((routine) => {
        const routineData = phrasesData[routine]
        for (let i = 0; i < routineData.English.length; i++) {
          newQuizData.push({
            question: `How do you say "${routineData.English[i]}" in Spanish?`,
            correct: routineData.Spanish[i],
            category: routine,
          })
        }
      })
    }

    const shuffled = newQuizData.sort(() => Math.random() - 0.5).slice(0, 5)
    setQuizData(shuffled)
    setCurrentQuestionIndex(0)
    setQuizScore(0)
    setShowQuizGame(true)
    setShowQuizResults(false)
    setSelectedAnswer(null)
    setShowFeedback(false)
  }

  const startFlashcardSession = () => {
    const allCards: FlashCard[] = []

    // Add vocabulary cards
    Object.keys(vocabularyData).forEach((category) => {
      const categoryData = vocabularyData[category]
      for (let i = 0; i < categoryData.English.length; i++) {
        allCards.push({
          id: `vocab_${category}_${i}`,
          type: "vocabulary",
          category,
          english: categoryData.English[i],
          spanish: categoryData.Spanish[i],
          pronunciation: categoryData.Pronunciation[i],
        })
      }
    })

    // Add phrase cards
    Object.keys(phrasesData).forEach((routine) => {
      const routineData = phrasesData[routine]
      for (let i = 0; i < routineData.English.length; i++) {
        allCards.push({
          id: `phrase_${routine}_${i}`,
          type: "phrases",
          category: routine,
          english: routineData.English[i],
          spanish: routineData.Spanish[i],
          pronunciation: routineData.Pronunciation[i],
        })
      }
    })

    // Shuffle and limit to 20 cards
    const shuffledCards = allCards.sort(() => Math.random() - 0.5).slice(0, 20)
    setFlashcards(shuffledCards)
    setCurrentCardIndex(0)
    setIsCardFlipped(false)
    setSessionCorrect([])
    setSessionIncorrect([])
    setShowCardResults(false)
    setCardSessionActive(true)
  }

  const generateAnswerOptions = (currentQuestion: QuizQuestion) => {
    const options = [currentQuestion.correct]
    const allAnswers: string[] = []

    if (currentQuestion.category in vocabularyData) {
      Object.keys(vocabularyData).forEach((category) => {
        vocabularyData[category].English.forEach((word) => {
          if (word !== currentQuestion.correct) {
            allAnswers.push(word)
          }
        })
      })
    } else {
      Object.keys(phrasesData).forEach((routine) => {
        phrasesData[routine].Spanish.forEach((phrase) => {
          if (phrase !== currentQuestion.correct) {
            allAnswers.push(phrase)
          }
        })
      })
    }

    const shuffledWrong = allAnswers.sort(() => Math.random() - 0.5).slice(0, 3)
    options.push(...shuffledWrong)

    return options
  }

  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer)
    setShowFeedback(true)

    const isCorrect = answer === quizData[currentQuestionIndex].correct
    if (isCorrect) {
      setQuizScore((prev) => prev + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 >= quizData.length) {
      const percentage = (quizScore / quizData.length) * 100
      let stars = 1
      if (percentage >= 80) stars = 3
      else if (percentage >= 60) stars = 2

      addStars(stars)
      addWords(quizData.length)
      addQuizGrade(`${quizScore}/${quizData.length}`)

      setShowQuizGame(false)
      setShowQuizResults(true)
    } else {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    }
  }

  const resetQuiz = () => {
    setShowQuizResults(false)
    setShowQuizGame(false)
    setCurrentQuestionIndex(0)
    setQuizScore(0)
  }

  // Flashcard functions
  const flipCard = () => {
    setIsCardFlipped(!isCardFlipped)
  }

  const markCardCorrect = () => {
    if (currentCardIndex < flashcards.length) {
      const currentCard = flashcards[currentCardIndex]
      setSessionCorrect((prev) => [...prev, currentCard])
      nextCard()
    }
  }

  const markCardIncorrect = () => {
    if (currentCardIndex < flashcards.length) {
      const currentCard = flashcards[currentCardIndex]
      setSessionIncorrect((prev) => [...prev, currentCard])
      nextCard()
    }
  }

  const nextCard = () => {
    if (currentCardIndex + 1 >= flashcards.length) {
      // Session complete - save as quiz grade
      const score = sessionCorrect.length
      const total = flashcards.length
      addQuizGrade(`${score}/${total}`)

      setShowCardResults(true)
      setCardSessionActive(false)

      // Update stats
      const stars = Math.max(1, Math.floor((score / total) * 3))
      addStars(stars)
      addWords(total)
    } else {
      setCurrentCardIndex((prev) => prev + 1)
      setIsCardFlipped(false)
    }
  }

  const resetFlashcardSession = () => {
    setCardSessionActive(false)
    setShowCardResults(false)
    setFlashcards([])
    setCurrentCardIndex(0)
    setIsCardFlipped(false)
    setSessionCorrect([])
    setSessionIncorrect([])
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header isDarkMode={isDarkMode} onToggleDarkModeAction={toggleDarkMode} />
        <Navigation />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Target className="h-6 w-6" />
              Practice Quiz
            </h2>
            <Button variant="outline" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>

          {!showQuizGame && !showQuizResults && !cardSessionActive && !showCardResults && (
            <div className="max-w-md mx-auto space-y-4">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-center text-foreground">Choose Your Quiz Type:</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                    onClick={() => startQuiz("vocabulary")}
                  >
                    Vocabulary Quiz
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-border text-foreground hover:bg-muted bg-transparent"
                    onClick={() => startQuiz("phrases")}
                  >
                    Phrases Quiz
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-border text-foreground hover:bg-muted bg-transparent"
                    onClick={startFlashcardSession}
                  >
                    Flashcards
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Quiz Game Logic */}
          {showQuizGame && quizData.length > 0 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">
                      Question {currentQuestionIndex + 1} of {quizData.length}
                    </span>
                    <Badge
                      variant="outline"
                      className="border-yellow-400 text-yellow-700 dark:border-yellow-600 dark:text-yellow-300"
                    >
                      Score: {quizScore}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-center text-foreground">
                    {quizData[currentQuestionIndex]?.question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quizData[currentQuestionIndex] &&
                    (() => {
                      const currentQuestion = quizData[currentQuestionIndex]
                      if (!currentQuestion.options) {
                        currentQuestion.options = generateAnswerOptions(currentQuestion)
                      }

                      return currentQuestion.options.map((option: string, index: number) => {
                        const isCorrect = option === currentQuestion.correct
                        const isSelected = selectedAnswer === option

                        let buttonClass = "w-full justify-start text-left h-auto p-4 transition-colors"

                        if (showFeedback) {
                          if (isCorrect) {
                            buttonClass +=
                              " bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:border-green-500 dark:text-green-300"
                          } else if (isSelected && !isCorrect) {
                            buttonClass +=
                              " bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:border-red-500 dark:text-red-300"
                          } else {
                            buttonClass += " opacity-60"
                          }
                        } else {
                          buttonClass += " hover:bg-muted border-border"
                        }

                        return (
                          <Button
                            key={index}
                            variant="outline"
                            className={buttonClass}
                            onClick={() => !showFeedback && handleAnswerClick(option)}
                            disabled={showFeedback}
                          >
                            {option}
                          </Button>
                        )
                      })
                    })()}

                  {showFeedback && (
                    <div className="text-center pt-4">
                      <div
                        className={`text-lg font-semibold mb-4 ${
                          selectedAnswer === quizData[currentQuestionIndex].correct
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {selectedAnswer === quizData[currentQuestionIndex].correct
                          ? "¡Correcto! Excellent!"
                          : "¡Inténtalo otra vez! Try again next time!"}
                      </div>
                      <Button className="bg-yellow-500 hover:bg-yellow-600 text-white" onClick={nextQuestion}>
                        {currentQuestionIndex + 1 >= quizData.length ? "Finish Quiz" : "Next Question"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Quiz Results */}
          {showQuizResults && (
            <div className="max-w-md mx-auto">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-center text-foreground">¡Excelente! Great Job!</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">
                    {quizScore} / {quizData.length}
                  </div>
                  <div className="text-2xl">
                    {"⭐".repeat(Math.min(3, Math.max(1, Math.floor((quizScore / quizData.length) * 3))))}
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-white" onClick={resetQuiz}>
                      Play Again
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/")}>
                      Back to Home
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Flashcard Session */}
          {cardSessionActive && flashcards.length > 0 && (
            <div className="max-w-md mx-auto space-y-6">
              {/* Progress */}
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">
                      Card {currentCardIndex + 1} of {flashcards.length}
                    </span>
                    <div className="flex gap-4 text-sm">
                      <span className="text-green-600 dark:text-green-400">✓ {sessionCorrect.length}</span>
                      <span className="text-red-600 dark:text-red-400">✗ {sessionIncorrect.length}</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentCardIndex / flashcards.length) * 100}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Flashcard */}
              <div className="relative h-80 perspective-1000">
                <div
                  className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d cursor-pointer ${
                    isCardFlipped ? "rotate-y-180" : ""
                  }`}
                  onClick={flipCard}
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isCardFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* Front of card */}
                  <Card className="absolute inset-0 backface-hidden border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20">
                    <CardContent className="flex flex-col items-center justify-center h-full text-center p-6">
                      <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300 mb-4">
                        {flashcards[currentCardIndex]?.spanish}
                      </div>
                      <Badge variant="secondary" className="mb-4">
                        {flashcards[currentCardIndex]?.pronunciation}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {flashcards[currentCardIndex]?.type === "vocabulary" ? "📚 Vocabulary" : "🏠 Phrase"}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">Tap to reveal English</div>
                    </CardContent>
                  </Card>

                  {/* Back of card */}
                  <Card
                    className="absolute inset-0 backface-hidden border-2 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    <CardContent className="flex flex-col items-center justify-center h-full text-center p-6">
                      <div className="text-2xl font-bold text-green-700 dark:text-green-300 mb-4">
                        {flashcards[currentCardIndex]?.english}
                      </div>
                      <div className="text-lg text-muted-foreground mb-4">{flashcards[currentCardIndex]?.spanish}</div>
                      <Badge variant="secondary" className="mb-4">
                        {flashcards[currentCardIndex]?.pronunciation}
                      </Badge>
                      <div className="text-sm text-muted-foreground">Did you get it right?</div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Action buttons (only show when flipped) */}
              {isCardFlipped && (
                <div className="flex gap-4 justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-red-400 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400 bg-transparent"
                    onClick={markCardIncorrect}
                  >
                    <span className="text-2xl mr-2">👎</span>
                    Incorrect
                  </Button>
                  <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white" onClick={markCardCorrect}>
                    <span className="text-2xl mr-2">👍</span>
                    Correct
                  </Button>
                </div>
              )}

              {/* Instructions */}
              <Card className="border-border bg-muted/50">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    <strong>Instructions:</strong> Tap the card to flip it and see the English translation. Then mark
                    whether you got it right or wrong!
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Flashcard Results with Old Style Summary */}
          {showCardResults && (
            <div className="max-w-2xl mx-auto space-y-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-center text-foreground">Session Complete! 🎉</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {sessionCorrect.length}
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300">Correct</div>
                    </div>
                    <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="text-3xl font-bold text-red-600 dark:text-red-400">{sessionIncorrect.length}</div>
                      <div className="text-sm text-red-700 dark:text-red-300">Incorrect</div>
                    </div>
                  </div>

                  <div className="text-xl font-semibold text-foreground">
                    Score: {Math.round((sessionCorrect.length / flashcards.length) * 100)}%
                  </div>

                  <div className="text-3xl">
                    {"⭐".repeat(Math.max(1, Math.floor((sessionCorrect.length / flashcards.length) * 3)))}
                  </div>
                </CardContent>
              </Card>

              {/* Words to Study More - Old Style */}
              {sessionIncorrect.length > 0 && (
                <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10">
                  <CardHeader>
                    <CardTitle className="text-red-600 dark:text-red-400">Words to Study More</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {sessionIncorrect.map((card, index) => (
                      <div
                        key={index}
                        className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                          <div>
                            <div className="font-bold text-red-700 dark:text-red-300">{card.spanish}</div>
                            <div className="text-sm text-red-600 dark:text-red-400">{card.english}</div>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant="secondary"
                              className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                            >
                              {card.pronunciation}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Words You Know Well - Old Style */}
              {sessionCorrect.length > 0 && (
                <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10">
                  <CardHeader>
                    <CardTitle className="text-green-600 dark:text-green-400">Words You Know Well</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {sessionCorrect.map((card, index) => (
                        <div
                          key={index}
                          className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-green-700 dark:text-green-300">{card.spanish}</span>
                              <span className="mx-2 text-green-600 dark:text-green-400">→</span>
                              <span className="text-green-600 dark:text-green-400">{card.english}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-2 justify-center">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white" onClick={startFlashcardSession}>
                  New Session
                </Button>
                <Button variant="outline" onClick={resetFlashcardSession}>
                  Back to Menu
                </Button>
              </div>
            </div>
          )}

          <TodaysProgress />
        </div>
      </div>
    </div>
  )
}
