"use client"

import { Users } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { BiExit } from "react-icons/bi"
import { GiTrophy } from "react-icons/gi"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn, getRandomNumber } from "@/lib/utils"

type Team = {
    teamName: string
    teamOwner: string
}

const CurrentPick = ({
    currentPick,
    teams,
    done,
    confirm,
}: {
    currentPick: number
    teams: Team[]
    done: boolean
    confirm: () => void
}) => {
    if (done) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    Order Confirmed
                </h2>
                <button
                    onClick={confirm}
                    className="cursor-pointer hover:scale-105 transition-all duration-300"
                >
                    <Card className="w-full border-2 border-blue-500 dark:border-blue-500 ">
                        <CardContent className="text-2xl font-bold flex items-center justify-center flex-col gap-2 hover:text-white hover:dark:text-white text-blue-500 dark:text-blue-500 transition-all duration-300">
                            <div>All Picks Confirmed</div>
                            <div>Click Here To Start Draft</div>
                        </CardContent>
                    </Card>
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Current Pick
            </h2>
            <Card className="w-full">
                <CardContent className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center">
                    {teams[currentPick]?.teamName || "N/A"}
                </CardContent>
            </Card>
        </div>
    )
}

type OrderPickingProps = {
    teams: Team[]
    roundCount: number
    name: string
    exit: () => void
    setOrder: (teamOrder: Team[]) => void
    startDraft: () => void
}

const OrderPicking = ({
    teams,
    roundCount,
    name,
    exit,
    setOrder,
    startDraft,
}: OrderPickingProps) => {
    const numberOfDraftPositions = teams.length
    const [currentPick, setCurrentPick] = useState(-1)
    const [teamOrder, setTeamOrder] = useState<(Team | undefined)[]>(teams.map(() => undefined))
    const [teamsAlreadyPicked, setTeamsAlreadyPicked] = useState<number[]>([])

    const spotsTaken = useMemo(
        () =>
            teamOrder
                .map((team, index) => (team ? index : null))
                .filter((index) => index !== null) as number[],
        [teamOrder]
    )

    const getRandomTeam = useCallback(() => {
        return getRandomNumber(0, numberOfDraftPositions - 1, teamsAlreadyPicked)
    }, [numberOfDraftPositions, teamsAlreadyPicked])

    const handleNextPick = useCallback(() => {
        setCurrentPick(getRandomTeam())
    }, [getRandomTeam])

    const handlePick = useCallback(
        (index: number, team: Team, teamIndex: number) => {
            setTeamsAlreadyPicked((prev) => [...prev, teamIndex])
            setTeamOrder((prev) => prev.map((t, i) => (i === index ? team : t)))
            handleNextPick()
        },
        [handleNextPick]
    )

    const handleContinue = useCallback(() => {
        if (teamOrder.every((team) => team !== undefined)) {
            setOrder(teamOrder as Team[])
            startDraft()
        }
    }, [setOrder, teamOrder, startDraft])

    useEffect(() => {
        handleNextPick()
    }, [handleNextPick])

    return (
        <div className="flex flex-col items-center justify-center container mx-auto p-10 pt-2 h-screen w-screen gap-4">
            {/* Header */}
            <div className="my-4 flex flex-col items-center justify-center space-y-4 w-full">
                <div className="flex flex-row items-center justify-around gap-4 w-full relative">
                    <h1 className="text-4xl font-bold font-sans">Pick Order For: {name} Draft</h1>
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

            {/* Current Pick */}
            <CurrentPick
                currentPick={currentPick}
                teams={teams}
                done={teamOrder.every((team) => team !== undefined)}
                confirm={handleContinue}
            />

            {/* Pick Spots */}
            <div className="flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    Draft Teams
                </h2>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 w-full">
                {Array.from({ length: numberOfDraftPositions }).map((_, index) => (
                    <div key={index} className="flex flex-col items-center justify-center">
                        <button
                            onClick={() => handlePick(index, teams[currentPick], currentPick)}
                            className={cn(
                                "cursor-pointer hover:scale-105 transition-all duration-300",
                                spotsTaken.includes(index) && "cursor-not-allowed hover:scale-100"
                            )}
                        >
                            <Card
                                className={cn(
                                    "border-dashed border-2 border-gray-300 dark:border-gray-600 px-6",
                                    spotsTaken.includes(index) &&
                                        "border-solid border-2 border-gray-300 dark:border-gray-600"
                                )}
                            >
                                <CardHeader>
                                    <CardTitle>
                                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2">
                                            Pick #{index + 1}
                                        </h2>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                        <Users className="w-6 h-6" />
                                        {teamOrder[index]?.teamName || `Team ${index + 1}`}
                                    </h2>
                                </CardContent>
                            </Card>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default OrderPicking
