import {
  Heart,
  Users,
  MapPin,
  Smile,
  Hand,
  Palette,
  Apple,
  Activity,
  Sun,
  Utensils,
  Gamepad2,
  Moon,
  BookOpen,
} from "lucide-react"

export const getCategoryIcon = (category: string) => {
  const iconMap: { [key: string]: any } = {
    Essential_Greetings: Heart,
    Family_Members: Users,
    Spatial_Words: MapPin,
    Feelings_Emotions: Smile,
    Body_Parts: Hand,
    Colors: Palette,
    Food_Basics: Apple,
    Daily_Actions: Activity,
    Morning: Sun,
    Meals: Utensils,
    Playtime: Gamepad2,
    Bedtime: Moon,
  }
  return iconMap[category] || BookOpen
}

export const formatCategoryName = (category: string): string => {
  return category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
}
