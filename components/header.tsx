"use client"

import { Flag, Sun, Moon } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkModeAction: () => void;
}

export function Header({ isDarkMode, onToggleDarkModeAction }: HeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <Flag className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
        <h1 className="text-2xl font-bold text-foreground">Vocabdia</h1>
      </div>

      <div className="flex items-center space-x-2">
        <Sun className="h-4 w-4 text-yellow-600" />
        <Switch
          checked={isDarkMode}
          onCheckedChange={onToggleDarkModeAction}
          className="data-[state=checked]:bg-yellow-600"
        />
        <Moon className="h-4 w-4 text-yellow-600" />
        <Label htmlFor="dark-mode" className="sr-only">
          Toggle dark mode
        </Label>
      </div>
    </div>
  )
}
