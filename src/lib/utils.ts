import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"]

export const getTeamColor = (index: number) => {
    return colors[index % colors.length]
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
