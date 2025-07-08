"use client"

// TypeScript declaration for dom-to-image
declare module "dom-to-image" {
    interface DomToImageOptions {
        quality?: number
        bgcolor?: string
        width?: number
        height?: number
        style?: Record<string, string>
    }

    export function toPng(node: HTMLElement, options?: DomToImageOptions): Promise<string>
    export function toJpeg(node: HTMLElement, options?: DomToImageOptions): Promise<string>
    export function toBlob(node: HTMLElement, options?: DomToImageOptions): Promise<Blob>
}

import { useEffect, useState } from "react"
import { Timer, Users } from "lucide-react"
import { GiTrophy } from "react-icons/gi"
import { BiExit, BiImage } from "react-icons/bi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    cn,
    formatTime,
    getTeamBorderColor,
    getTeamColor,
    getTeamFadedColor,
    getTeamTextColor,
} from "@/lib/utils"
import { ThemeToggle } from "@/components/ui/theme-toggle"

import ImageCell from "./imageCell"
import { Button } from "@/components/ui/button"

type TeamData = {
    teamName: string
    teamOwner: string
}

const TeamCard = ({
    team,
    teamIndex,
    currentPickTeamIndex,
    roundCount,
}: {
    team: TeamData
    teamIndex: number
    currentPickTeamIndex: number
    roundCount: number
}) => {
    // TODO: Add a way to track number of picks on a team
    return (
        <Card
            key={teamIndex}
            className={cn(
                "relative overflow-hidden border-2 hover:shadow-lg transition-shadow w-full pt-4 gap-4",
                currentPickTeamIndex === teamIndex &&
                    `border-2 ${getTeamBorderColor(teamIndex)} shadow-lg`
            )}
        >
            {/* {currentPickTeamIndex === teamIndex && (
                <div
                    className={`absolute top-0 left-0 justify-center flex w-full font-bold text-blue-400 uppercase`}
                >
                    Current Pick
                </div>
            )} */}
            <div className={`h-2 ${getTeamColor(teamIndex)}`} />
            <CardHeader>
                <CardTitle className="text-xl text-slate-800 dark:text-slate-200">
                    {team.teamName}
                </CardTitle>
                <p className="text-slate-600 dark:text-slate-400">Owner: {team.teamOwner}</p>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                        Picks: 0/{roundCount}
                    </span>
                    <div className={`w-3 h-3 rounded-full ${getTeamColor(teamIndex)}`} />
                </div>
            </CardContent>
        </Card>
    )
}

type GridProps = {
    teams: TeamData[]
    roundCount: number
    name: string
    exit: () => void
    timerLength?: number
}

const Grid = ({ teams, roundCount, name, exit, timerLength = 300 }: GridProps) => {
    const [currentPick, setCurrentPick] = useState(0)
    const [timer, setTimer] = useState(timerLength)

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(Math.max(0, timer - 1))
        }, 1000)
        return () => clearInterval(interval)
    }, [timer])

    const _setCurrentPick = (pick: number) => {
        setCurrentPick(pick)
        setTimer(timerLength)
    }

    const getCurrentPickTeam = (pick: number): [number, TeamData | null] => {
        const round = Math.floor(pick / teams.length)
        const col = pick % teams.length
        if (round % 2 === 0) {
            return [col, teams[col]]
        } else {
            return [teams.length - col - 1, teams[teams.length - col - 1]]
        }
    }

    const [currentPickTeamIndex] = getCurrentPickTeam(currentPick)

    const saveAsImage = async () => {
        console.log()
    }

    return (
        <div className="flex flex-col items-center justify-center container mx-auto p-10 pt-2">
            {/* Header */}
            <div className="my-4 flex flex-col items-center justify-center space-y-4 w-full">
                <div className="flex flex-row items-center justify-around gap-4 w-full relative">
                    <h1 className="text-4xl font-bold font-sans">{name}</h1>
                    <div className="flex items-center gap-2 absolute right-20">
                        <ThemeToggle />
                        <button
                            onClick={exit}
                            type="button"
                            className="border border-gray-300 dark:border-gray-600 text-black dark:text-white p-2 rounded-md px-4 cursor-pointer"
                        >
                            <BiExit className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="rounded-full border border-gray-300 dark:border-gray-600 p-2 px-4 flex flex-row items-center justify-center gap-2">
                    <GiTrophy className="w-5 h-5" />
                    <span className="font-bold">
                        {roundCount} Round{roundCount > 1 ? "s" : ""} Total
                    </span>
                </div>
            </div>

            {/* Teams */}
            <div className="mb-6 w-full">
                <div className="flex flex-row items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <Users className="w-6 h-6" />
                        Draft Teams
                    </h2>
                    <div className="flex flex-row items-end gap-6">
                        <div className="flex flex-row items-end justify-end gap-1 text-2xl font-bold">
                            <span>Current Pick:</span>
                            <span className={cn(getTeamTextColor(currentPickTeamIndex))}>
                                {teams[currentPickTeamIndex]?.teamName}
                            </span>
                        </div>
                        <div>
                            <div className="text-sm text-slate-500 dark:text-slate-400 justify-center flex">
                                Round Timer
                            </div>
                            <Button className="bg-blue-300/30 border-blue-800 border-2 text-black dark:text-white text-2xl px-6 py-4 rounded-xl cursor-pointer flex flex-row items-center gap-2">
                                <div className="flex flex-row items-center gap-2">
                                    <Timer className="min-w-5 min-h-5" />
                                </div>
                                <div className="font-mono">{formatTime(timer)}</div>
                            </Button>
                        </div>
                    </div>
                </div>
                <div className={cn(`w-full flex flex-row items-center justify-center gap-4`)}>
                    {teams.map((team, index) => (
                        <TeamCard
                            key={index}
                            team={team}
                            teamIndex={index}
                            currentPickTeamIndex={currentPickTeamIndex}
                            roundCount={roundCount}
                        />
                    ))}
                </div>
            </div>

            {/* Draft Board */}
            <div className="space-y-2 w-full">
                <div className="flex flex-row items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <GiTrophy className="w-6 h-6" />
                        Draft Board
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={saveAsImage}
                            type="button"
                            className="border border-gray-300 dark:border-gray-600 text-black dark:text-white p-2 rounded-md px-4 cursor-pointer flex flex-row items-center gap-2"
                        >
                            <BiImage className="w-5 h-5" />
                            Save as Image
                        </button>
                    </div>
                </div>

                {Array.from({ length: roundCount }, (_, roundIndex) => (
                    <div key={roundIndex} className="space-y-4 w-full">
                        <div className="flex items-center gap-3 mb-3 mt-3">
                            <Badge
                                variant="secondary"
                                className="text-lg px-4 py-2 dark:bg-slate-700"
                            >
                                Round {roundIndex + 1}
                            </Badge>
                            <div className="h-px bg-slate-300 flex-1" />
                        </div>

                        <div className="flex flex-row items-center justify-center gap-4">
                            {/* Round Header Card */}
                            {/* {teams.length < 6 && (
                                <Card className="bg-slate-800 dark:bg-slate-700 text-white border-slate-700 w-full max-h-40">
                                    <CardContent className="flex items-center justify-center h-32">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold mb-1">
                                                Round {roundIndex + 1}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )} */}

                            {/* Pick Cards */}
                            {Array.from({ length: teams.length }, (_, colIndex) => {
                                let overallIndex = roundIndex * teams.length + colIndex
                                let pickIndex = colIndex

                                if (roundIndex % 2 !== 0) {
                                    pickIndex = teams.length - colIndex - 1
                                    overallIndex = roundIndex * teams.length + pickIndex
                                }

                                return (
                                    <ImageCell
                                        className="max-h-40"
                                        key={overallIndex}
                                        keyString={`pick-${overallIndex}`}
                                        index={pickIndex}
                                        overallIndex={overallIndex}
                                        teamOwner={
                                            teams[colIndex]?.teamOwner || `Team ${colIndex + 1}`
                                        }
                                        color={getTeamColor(colIndex)}
                                        borderColor={getTeamBorderColor(colIndex)}
                                        fadedColor={getTeamFadedColor(colIndex)}
                                        isActive={currentPick >= overallIndex}
                                        onSuccess={() => {
                                            if (currentPick === overallIndex) {
                                                _setCurrentPick(currentPick + 1)
                                            }
                                        }}
                                    />
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Grid

// TODOS:
// Over 3 picks per round makes the grid funky
// save imgs in local storage
// save everything in local storage
// popup for text entry with img copy
