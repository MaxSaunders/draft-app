"use client"

import { useEffect, useState } from "react"
import {
    FieldArrayWithId,
    FieldErrors,
    useFieldArray,
    useForm,
    UseFormRegister,
} from "react-hook-form"
import { z } from "zod"
import { useLocalStorage } from "usehooks-ts"

import Grid from "./components/grid"
import { zodResolver } from "@hookform/resolvers/zod"
import { BiMinus, BiPlay, BiPlus, BiTrash } from "react-icons/bi"
import { FiUsers } from "react-icons/fi"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import OrderPicking from "./components/orderPicking"

const teamSchema = z.object({
    teamName: z.string().min(1, { message: "Team name is required" }),
    teamOwner: z.string().min(1, { message: "Team owner is required" }),
})

type Team = z.infer<typeof teamSchema>

const draftSchema = z.object({
    teams: z.array(teamSchema).min(2, { message: "Must have at least 2 teams" }),
    roundCount: z.number().min(1, { message: "Round count must be at least 1" }),
    roundTimer: z.number().min(1, { message: "Round timer must be at least 1" }),
    name: z.string().min(1, { message: "Name is required" }),
})

type DraftData = z.infer<typeof draftSchema>

type TeamRowProps = {
    field: FieldArrayWithId<DraftData, "teams", "id">
    register: UseFormRegister<DraftData>
    index: number
    removeTeam: (index: number) => void
    errors: FieldErrors<DraftData>
    canRemove: boolean
}

const TeamRow = ({ register, index, removeTeam, errors, canRemove }: TeamRowProps) => {
    const nameError = errors.teams?.[index]?.teamName
    const ownerError = errors.teams?.[index]?.teamOwner

    return (
        <div className="flex flex-row gap-2 items-end justify-center w-full flex-wrap">
            <div className="flex flex-col gap-2 min-w-44 flex-grow-2">
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                    {...register(`teams.${index}.teamName`)}
                    className="border border-gray-300 dark:border-gray-600 rounded-md p-2"
                />
                {nameError && <p className="text-red-500">{nameError.message}</p>}
            </div>
            <div className="flex flex-col gap-2 min-w-44 flex-grow-2">
                <Label htmlFor="teamOwner">Team Owner</Label>
                <Input
                    {...register(`teams.${index}.teamOwner`)}
                    className="border border-gray-300 dark:border-gray-600 rounded-md p-2"
                />
                {ownerError && <p className="text-red-500">{ownerError.message}</p>}
            </div>
            {canRemove && (
                <div className="flex flex-col gap-2 min-w-44 w-min-fit">
                    <Button
                        type="button"
                        className="bg-red-500 text-white p-2 rounded-md cursor-pointer flex items-center justify-center gap-2"
                        onClick={() => removeTeam(index)}
                    >
                        <BiTrash className="w-4 h-4" />
                        Remove Team
                    </Button>
                </div>
            )}
        </div>
    )
}

export default function Home() {
    const [isMounted, setIsMounted] = useState(false)
    const [status, setStatus] = useState<"not-started" | "order-picking" | "drafting" | "drafted">(
        "not-started"
    )
    const [draftName, setDraftName] = useLocalStorage<string>("draftName", "", {
        initializeWithValue: true,
    })
    const [roundTimer, setRoundTimer] = useLocalStorage<number>("roundTimer", 5, {
        initializeWithValue: true,
    })
    const [roundCount, setRoundCount] = useLocalStorage<number>("roundCount", 5, {
        initializeWithValue: true,
    })
    const [teams, setTeams] = useLocalStorage<Team[]>(
        "teams",
        [
            { teamName: "", teamOwner: "" },
            { teamName: "", teamOwner: "" },
        ],
        {
            initializeWithValue: true,
        }
    )

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        formState: { errors },
    } = useForm<DraftData>({
        defaultValues: {
            roundCount,
            teams,
            name: draftName,
            roundTimer,
        },
        resolver: zodResolver(draftSchema),
    })

    const { fields, append, remove } = useFieldArray({
        control: control,
        name: "teams",
    })

    const addTeam = () => {
        append({ teamName: "", teamOwner: "" })
    }

    const removeTeam = (index: number) => {
        remove(index)
    }

    const startDraft = (data: DraftData) => {
        setTeams(data.teams)
        setDraftName(data.name)
        setRoundCount(data.roundCount)
        setRoundTimer(data.roundTimer)
        setStatus("order-picking")
    }

    const roundCountWatch = watch("roundCount")
    const roundTimerWatch = watch("roundTimer")
    const teamsWatch = watch("teams")
    const nameWatch = watch("name")

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return <div>Loading...</div>
    }

    if (status === "order-picking") {
        return (
            <OrderPicking
                teams={teamsWatch}
                roundCount={roundCountWatch}
                name={nameWatch}
                exit={() => setStatus("not-started")}
                setOrder={setTeams}
                startDraft={() => setStatus("drafting")}
            />
        )
    }

    if (status === "drafting") {
        return (
            <Grid
                teams={teams}
                roundCount={roundCountWatch}
                name={nameWatch}
                exit={() => setStatus("not-started")}
                timerLength={roundTimer * 60}
            />
        )
    }

    const hasErrors = Object.keys(errors).length > 0

    return (
        <div className="flex flex-col items-start justify-center h-screen space-y-8 container mx-auto p-10">
            <form
                onSubmit={handleSubmit(startDraft)}
                className="flex flex-col items-center justify-center space-y-8 w-full"
            >
                <div className="flex flex-col items-center justify-center gap-4 w-full">
                    <div className="relative flex flex-row items-center justify-center gap-4 w-full">
                        <h1 className="text-4xl font-bold">Draft Simulator</h1>
                        <div className="absolute right-0 top-0">
                            <ThemeToggle />
                        </div>
                    </div>
                    <h2 className="text-xl">Setup your draft and manage teams</h2>
                </div>
                {hasErrors && (
                    <div className="flex flex-col items-center justify-center gap-8 shadow-lg border border-gray-300 rounded-md p-6">
                        <h2 className="text-2xl text-red-500">
                            Errors! {Object.values(errors)[0]?.message}
                        </h2>
                    </div>
                )}
                <div className="flex flex-col items-start gap-8 shadow-lg border border-gray-300 rounded-md p-6 w-full">
                    <div className="flex flex-row items-center justify-start gap-4">
                        <FiUsers className="w-6 h-6" />
                        <h1 className="text-2xl font-bold">Draft Configuration</h1>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Draft Name</Label>
                            <Input
                                className="border border-gray-300 dark:border-gray-600 rounded-md p-2"
                                {...register("name")}
                            />
                        </div>
                        <div className="flex flex-row items-center gap-8 w-full flex-wrap justify-center lg:justify-start">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="roundCount">Round Count</Label>
                                <div className="flex flex-row items-center justify-start text-xl font-bold gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="cursor-pointer"
                                        onClick={() =>
                                            setValue("roundCount", Math.max(roundCountWatch - 1, 1))
                                        }
                                    >
                                        <BiMinus className="w-4 h-4" />
                                    </Button>
                                    <div className="py-2 px-5 rounded-2xl bg-gray-200 dark:bg-gray-700">
                                        {roundCountWatch}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="cursor-pointer"
                                        onClick={() =>
                                            setValue(
                                                "roundCount",
                                                Math.min(roundCountWatch + 1, 100)
                                            )
                                        }
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="roundCount">Round Timer</Label>
                                <div className="flex flex-row items-center justify-start text-xl font-bold gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="cursor-pointer"
                                        onClick={() =>
                                            setValue("roundTimer", Math.max(roundTimerWatch - 1, 1))
                                        }
                                    >
                                        <BiMinus className="w-4 h-4" />
                                    </Button>
                                    <div className="py-2 px-5 rounded-2xl bg-gray-200 dark:bg-gray-700">
                                        {roundTimerWatch}:00
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="cursor-pointer"
                                        onClick={() =>
                                            setValue(
                                                "roundTimer",
                                                Math.min(roundTimerWatch + 1, 100)
                                            )
                                        }
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-8 shadow-lg border border-gray-300 rounded-md p-6 w-full">
                    <div className="flex flex-row items-center justify-between gap-4 w-full">
                        <div className="flex flex-row items-center justify-start gap-4">
                            <FiUsers className="w-6 h-6" />
                            <h1 className="text-2xl font-bold">Teams</h1>
                        </div>
                        <Button
                            type="button"
                            className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-lg"
                            onClick={addTeam}
                        >
                            <BiPlus className="w-4 h-4" />
                            <span>Add Team</span>
                        </Button>
                    </div>

                    {fields.map((field, index) => (
                        <TeamRow
                            key={field.id}
                            field={field}
                            register={register}
                            index={index}
                            removeTeam={removeTeam}
                            errors={errors}
                            canRemove={fields.length > 2}
                        />
                    ))}
                </div>
                <Button
                    type="submit"
                    size="lg"
                    className="text-lg bg-green-600 text-white rounded-md px-5 py-6 font-bold cursor-pointer flex items-center justify-center gap-2"
                >
                    <BiPlay className="w-8 min-w-8 h-8 min-h-8" />
                    <span className="text-xl">Start Draft</span>
                </Button>
            </form>
        </div>
    )
}
