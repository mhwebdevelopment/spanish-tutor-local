"use client"

import { useState } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      if (!item) return initialValue

      // Handle special case for theme which might be stored as plain string
      if (key === "theme" && (item === "dark" || item === "light")) {
        return item as T
      }

      // Try to parse as JSON, fallback to plain string
      try {
        return JSON.parse(item)
      } catch {
        return item as T
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== "undefined") {
        // Store theme as plain string, others as JSON
        if (key === "theme") {
          window.localStorage.setItem(key, String(valueToStore))
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue] as const
}
