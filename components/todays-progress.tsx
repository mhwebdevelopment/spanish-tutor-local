import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3 } from "lucide-react"
import { useStats } from "@/hooks/use-stats"

interface TodaysProgressProps {
  showTitle?: boolean
  className?: string
}

export function TodaysProgress({ showTitle = true, className = "" }: TodaysProgressProps) {
  const { stats } = useStats()

  // Calculate daily grade percentage
  const calculateDailyGrade = () => {
    if (stats.grades.length === 0) return 0

    const totalPercentages = stats.grades.reduce((sum, grade) => {
      const [correct, total] = grade.split("/").map(Number)
      return sum + (correct / total) * 100
    }, 0)

    return Math.round(totalPercentages / stats.grades.length)
  }

  const dailyGrade = calculateDailyGrade()

  return (
    <Card className={`border-border bg-card ${className}`}>
      {showTitle && (
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5" />
            Today's Progress
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={showTitle ? "pt-0" : "pt-4"}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          <div className="text-center">
            <div className="text-xl font-bold text-yellow-700 dark:text-yellow-300">{stats.stars}</div>
            <div className="text-xs text-muted-foreground">Stars Earned</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-yellow-700 dark:text-yellow-300">{stats.words}</div>
            <div className="text-xs text-muted-foreground">Words Explored</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-yellow-700 dark:text-yellow-300">{stats.grades.length}</div>
            <div className="text-xs text-muted-foreground">Quizzes Taken</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-yellow-700 dark:text-yellow-300">{dailyGrade}%</div>
            <div className="text-xs text-muted-foreground">Daily Grade</div>
          </div>
        </div>
        {stats.grades.length > 0 && (
          <div>
            <h4 className="font-medium text-foreground mb-2 text-sm">Quiz Grades</h4>
            <div className="flex flex-wrap gap-1">
              {stats.grades.map((grade, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-yellow-400 text-yellow-700 dark:border-yellow-600 dark:text-yellow-300 text-xs px-2 py-0.5"
                >
                  {grade}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
