"use client"

import { useState } from "react"
import { Users } from "lucide-react"
import { GiTrophy } from "react-icons/gi"
import { BiExit, BiPrinter } from "react-icons/bi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import ImageCell from "./imageCell"

const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"]

const getTeamColor = (index: number) => {
    return colors[index % colors.length]
}

type TeamData = {
    teamName: string
    teamOwner: string
}

type GridProps = {
    teams: TeamData[]
    roundCount: number
    name: string
    exit: () => void
}

const Grid = ({ teams, roundCount, name, exit }: GridProps) => {
    const [currentPick, setCurrentPick] = useState(0)

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

    const printGrid = () => {
        console.log(teams)
    }

    return (
        <div className="flex flex-col items-center justify-center container mx-auto p-10 pt-2">
            {/* Header */}
            <div className="my-4 flex flex-col items-center justify-center space-y-4 w-full">
                <div className="flex flex-row items-center justify-around gap-4 w-full">
                    <div />
                    <h1 className="text-4xl font-bold">{name}</h1>
                    <button
                        onClick={exit}
                        type="button"
                        className="border border-gray-300 text-black p-2 rounded-md px-4 cursor-pointer"
                    >
                        <BiExit className="w-5 h-5" />
                    </button>
                </div>
                <h2 className="text-xl">Draft your team</h2>
                <div className="rounded-full border border-gray-300 p-2 px-4 flex flex-row items-center justify-center gap-2">
                    <GiTrophy className="w-5 h-5" />
                    <span className="font-bold">
                        {roundCount} Round{roundCount > 1 ? "s" : ""} Total
                    </span>
                </div>
            </div>

            {/* Teams */}
            <div className="mb-6 w-full">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    Draft Teams
                </h2>
                <div className={cn(`w-full flex flex-row items-center justify-center gap-4`)}>
                    {teams.map((team, index) => (
                        <Card
                            key={index}
                            className={cn(
                                "relative overflow-hidden border-2 hover:shadow-lg transition-shadow w-full pt-6 gap-4",
                                currentPickTeamIndex === index &&
                                    "border-2 border-blue-400 shadow-lg"
                            )}
                        >
                            {currentPickTeamIndex === index && (
                                <div
                                    className={`absolute top-0 left-0 justify-center flex w-full font-bold text-blue-400 uppercase`}
                                >
                                    Current Pick
                                </div>
                            )}
                            <div className={`h-2 ${getTeamColor(index)}`} />
                            <CardHeader>
                                <CardTitle className="text-xl text-slate-800">
                                    {team.teamName}
                                </CardTitle>
                                <p className="text-slate-600">Owner: {team.teamOwner}</p>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500">Picks: 0/4</span>
                                    <div
                                        className={`w-3 h-3 rounded-full ${getTeamColor(index)}`}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Draft Board */}
            <div className="space-y-2 w-full">
                <div className="flex flex-row items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <GiTrophy className="w-6 h-6" />
                        Draft Board
                    </h2>
                    <button
                        onClick={printGrid}
                        type="button"
                        className="border border-gray-300 text-black p-2 rounded-md px-4 cursor-pointer flex flex-row items-center gap-2"
                    >
                        <BiPrinter className="w-5 h-5" />
                        Print Grid
                    </button>
                </div>

                {Array.from({ length: roundCount }, (_, roundIndex) => (
                    <div key={roundIndex} className="space-y-4 w-full">
                        <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="text-lg px-4 py-2">
                                Round {roundIndex + 1}
                            </Badge>
                            <div className="h-px bg-slate-300 flex-1" />
                        </div>

                        <div className="flex flex-row items-center justify-center gap-4">
                            {/* Round Header Card */}
                            <Card className="bg-slate-800 text-white border-slate-700 w-full max-h-40">
                                <CardContent className="flex items-center justify-center h-32">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold mb-1">
                                            Round {roundIndex + 1}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

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
                                        teamOwner={
                                            teams[colIndex]?.teamOwner || `Team ${colIndex + 1}`
                                        }
                                        color={getTeamColor(colIndex)}
                                        isActive={currentPick >= overallIndex}
                                        onSuccess={() => {
                                            if (currentPick === overallIndex) {
                                                setCurrentPick(currentPick + 1)
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
