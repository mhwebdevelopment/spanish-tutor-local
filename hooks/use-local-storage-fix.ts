// src/hooks/use-local-storage.ts
"use client"

import { useState } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue // SSR: stable initial value [no change] [6]
    }
    try {
      const item = window.localStorage.getItem(key)
      if (!item) return initialValue // nothing stored, keep initial [6]

      // BEFORE (problematic): returned string "dark"/"light" as T when key === "theme"
      // if (key === "theme" && (item === "dark" || item === "light")) {
      //   return item as T
      // }

      // AFTER: normalize legacy strings to boolean and migrate storage
      if (key === "theme") {
        // Accept legacy shapes and coerce to boolean (true => dark, false => light) [6]
        if (item === "dark" || item === '"dark"' || item === "true" || item === '"true"') {
          window.localStorage.setItem(key, JSON.stringify(true)) // migrate to boolean [6]
          return true as unknown as T
        }
        if (item === "light" || item === '"light"' || item === "false" || item === '"false"') {
          window.localStorage.setItem(key, JSON.stringify(false)) // migrate to boolean [6]
          return false as unknown as T
        }
      }

      // Keep JSON-first behavior for all keys (and post-migration theme) [6]
      try {
        return JSON.parse(item) as T
      } catch {
        // Fallback: accept raw string for non-theme keys [6]
        return item as unknown as T
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error) // keep visibility [6]
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)

      if (typeof window !== "undefined") {
        // BEFORE: wrote theme as String(valueToStore), allowing "light"/"dark" or "false"/"true" strings to persist
        // if (key === "theme") {
        //   window.localStorage.setItem(key, String(valueToStore))
        // } else {
        //   window.localStorage.setItem(key, JSON.stringify(valueToStore))
        // }

        // AFTER: always store a real boolean for theme; JSON for everything else
        if (key === "theme") {
          // If a non-boolean sneaks in, coerce to boolean by intent (dark=true) [6]
          const asBool =
            typeof valueToStore === "boolean"
              ? valueToStore
              : // tolerate legacy writes like "dark"/"light"/"true"/"false" [6]
                (valueToStore as unknown) === ("dark" as unknown) ||
                (valueToStore as unknown) === ("true" as unknown)
          window.localStorage.setItem(key, JSON.stringify(Boolean(asBool))) // persist boolean [6]
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore)) // unchanged [6]
        }
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error) // keep visibility [6]
    }
  }

  return [storedValue, setValue] as const
}
