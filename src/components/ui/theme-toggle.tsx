"use client"

import { Moon, Sun } from "lucide-react"
import { useDarkMode } from "@/components/providers/dark-mode-provider"

export function ThemeToggle() {
    const { isDark, toggleDark } = useDarkMode()

    return (
        <button
            onClick={toggleDark}
            type="button"
            className="cursor-pointer p-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            aria-label="Toggle theme"
        >
            {isDark ? (
                <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
                <Moon className="h-5 w-5 text-gray-700" />
            )}
        </button>
    )
}
