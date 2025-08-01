import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { DarkModeProvider } from "@/components/providers/dark-mode-provider"
import "./globals.css"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "Custom Draft App",
    description: "Custom Draft App",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <DarkModeProvider>{children}</DarkModeProvider>
            </body>
        </html>
    )
}
