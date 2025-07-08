import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"]
const fadedColors = [
    "bg-red-500/10",
    "bg-blue-500/10",
    "bg-green-500/10",
    "bg-yellow-500/10",
    "bg-purple-500/10",
]
const borderColors = [
    "border-red-500",
    "border-blue-500",
    "border-green-500",
    "border-yellow-500",
    "border-purple-500",
]
const textColors = [
    "text-red-500",
    "text-blue-500",
    "text-green-500",
    "text-yellow-500",
    "text-purple-500",
]

export const getTeamFadedColor = (index: number) => {
    return fadedColors[index % fadedColors.length]
}

export const getTeamColor = (index: number) => {
    return colors[index % colors.length]
}

export const getTeamTextColor = (index: number) => {
    return textColors[index % textColors.length]
}

export const getTeamBorderColor = (index: number) => {
    return borderColors[index % borderColors.length]
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
}
