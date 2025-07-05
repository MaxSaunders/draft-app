"use client"

import { createContext, useContext, useEffect, useState } from "react"

// Dark mode context
type DarkModeContextType = {
    isDark: boolean
    toggleDark: () => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined)

export const useDarkMode = () => {
    const context = useContext(DarkModeContext)
    if (!context) {
        throw new Error("useDarkMode must be used within a DarkModeProvider")
    }
    return context
}

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
    const [isDark, setIsDark] = useState(true)

    useEffect(() => {
        // Check for saved preference or system preference
        const saved = localStorage.getItem("darkMode")
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

        if (saved !== null) {
            setIsDark(saved === "true")
        } else {
            setIsDark(prefersDark)
        }
    }, [])

    useEffect(() => {
        // Apply dark class to html element
        const html = document.documentElement
        if (isDark) {
            html.classList.add("dark")
        } else {
            html.classList.remove("dark")
        }

        // Save preference
        localStorage.setItem("darkMode", isDark.toString())
    }, [isDark])

    const toggleDark = () => setIsDark(!isDark)

    return (
        <DarkModeContext.Provider value={{ isDark, toggleDark }}>
            {children}
        </DarkModeContext.Provider>
    )
}
