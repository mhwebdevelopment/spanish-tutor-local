"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BookOpen, Home, Target, Users, MessageCircle } from "lucide-react"

const navigationItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/vocabulary", label: "Vocabulary", icon: BookOpen },
  { path: "/phrases", label: "Phrases", icon: Home },
  { path: "/quiz", label: "Quiz", icon: Target },
  { path: "/chat", label: "Chat", icon: MessageCircle },
  { path: "/tips", label: "Tips", icon: Users },
]

export function Navigation() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
      {navigationItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.path

        return (
          <Button
            key={item.path}
            variant={isActive ? "default" : "outline"}
            className={
              isActive ? "bg-yellow-500 hover:bg-yellow-600 text-white" : "border-border text-foreground hover:bg-muted"
            }
            onClick={() => router.push(item.path)}
          >
            <Icon className="h-4 w-4 mr-2" />
            {item.label}
          </Button>
        )
      })}
    </div>
  )
}
