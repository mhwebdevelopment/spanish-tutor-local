import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DailyWordCardProps {
  spanish: string
  english: string
  pronunciation: string
}

export function DailyWordCard({ spanish, english, pronunciation }: DailyWordCardProps) {
  return (
    <Card className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
      <CardHeader>
        <CardTitle className="text-center">Word of the Day</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-2">
        <div className="text-3xl font-bold">{spanish}</div>
        <div className="text-xl opacity-90">{english}</div>
        <Badge variant="secondary" className="bg-white/20 text-white">
          {pronunciation}
        </Badge>
      </CardContent>
    </Card>
  )
}
