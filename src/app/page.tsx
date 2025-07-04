"use client"

import { useState } from "react"
import {
    FieldArrayWithId,
    FieldErrors,
    useFieldArray,
    useForm,
    UseFormRegister,
} from "react-hook-form"
import { z } from "zod"

import Grid from "./components/grid"
import { zodResolver } from "@hookform/resolvers/zod"
import { BiMinus, BiPlay, BiPlus, BiTrash } from "react-icons/bi"
import { FiUsers } from "react-icons/fi"

const teamSchema = z.object({
    teamName: z.string().min(1, { message: "Team name is required" }),
    teamOwner: z.string().min(1, { message: "Team owner is required" }),
})

type Team = z.infer<typeof teamSchema>

const draftSchema = z.object({
    teams: z.array(teamSchema).min(2, { message: "Must have at least 2 teams" }),
    roundCount: z.number().min(1, { message: "Round count must be at least 1" }),
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
        <div className="flex flex-row gap-2 items-end justify-center w-full">
            <div className="flex flex-col gap-2 w-full">
                <label htmlFor="teamName">Team Name</label>
                <input
                    {...register(`teams.${index}.teamName`)}
                    className="border border-gray-300 rounded-md p-2"
                />
                {nameError && <p className="text-red-500">{nameError.message}</p>}
            </div>
            <div className="flex flex-col gap-2 w-full">
                <label htmlFor="teamOwner">Team Owner</label>
                <input
                    {...register(`teams.${index}.teamOwner`)}
                    className="border border-gray-300 rounded-md p-2"
                />
                {ownerError && <p className="text-red-500">{ownerError.message}</p>}
            </div>
            {canRemove && (
                <div className="flex flex-col gap-2 w-full">
                    <button
                        type="button"
                        className="bg-red-500 text-white p-2 rounded-md cursor-pointer flex items-center justify-center gap-2"
                        onClick={() => removeTeam(index)}
                    >
                        <BiTrash className="w-4 h-4" />
                        Remove Team
                    </button>
                </div>
            )}
        </div>
    )
}

export default function Home() {
    const [isReady, setIsReady] = useState(false)
    // const [draftName, setDraftName] = useLocalStorage<string>("draftName", "")
    // const [roundCount, setRoundCount] = useLocalStorage<number>("roundCount", 1)
    // const [teams, setTeams] = useLocalStorage<Team[]>("teams", [
    //     { teamName: "", teamOwner: "" },
    //     { teamName: "", teamOwner: "" },
    // ])
    const [draftName, setDraftName] = useState<string>("")
    const [roundCount, setRoundCount] = useState<number>(1)
    // const [teams, setTeams] = useState<Team[]>([
    //     { teamName: "", teamOwner: "" },
    //     { teamName: "", teamOwner: "" },
    // ])
    const [teams, setTeams] = useState<Team[]>([
        { teamName: "Max's Team", teamOwner: "Max" },
        { teamName: "Stephen's Team", teamOwner: "Stephen" },
        { teamName: "David's Team", teamOwner: "David" },
    ])

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
        setIsReady(true)
    }

    const roundCountWatch = watch("roundCount")
    const teamsWatch = watch("teams")
    const nameWatch = watch("name")

    if (isReady) {
        return (
            <Grid
                teams={teamsWatch}
                roundCount={roundCountWatch}
                name={nameWatch}
                exit={() => setIsReady(false)}
            />
        )
    }

    const hasErrors = Object.keys(errors).length > 0

    return (
        <div className="flex flex-col items-start justify-center h-screen space-y-8 container mx-auto">
            <form
                onSubmit={handleSubmit(startDraft)}
                className="flex flex-col items-center justify-center space-y-8 w-full"
            >
                <div className="flex flex-col items-center justify-center gap-4 w-full">
                    <h1 className="text-4xl font-bold">Draft Simulator</h1>
                    <h2 className="text-xl">Setup your draft and manage teams</h2>
                </div>
                <div className="flex flex-col items-start gap-8 shadow-lg border border-gray-300 rounded-md p-6 w-full">
                    <div className="flex flex-row items-center justify-start gap-4">
                        <FiUsers className="w-6 h-6" />
                        <h1 className="text-2xl font-bold">Draft Configuration</h1>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name">Draft Name</label>
                            <input
                                className="border border-gray-300 rounded-md p-2"
                                {...register("name")}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="roundCount">Round Count</label>
                            <div className="flex flex-row items-center justify-start text-xl font-bold gap-4">
                                <button
                                    type="button"
                                    className="border border-gray-300 text-black rounded-md flex items-center justify-center font-bold cursor-pointer h-11 w-11"
                                    onClick={() =>
                                        setValue("roundCount", Math.max(roundCountWatch - 1, 1))
                                    }
                                >
                                    <BiMinus className="w-4 h-4" />
                                </button>
                                <div className="py-2 px-5 rounded-2xl bg-gray-200">
                                    {roundCountWatch}
                                </div>
                                <button
                                    type="button"
                                    className="border border-gray-300 text-black rounded-md flex items-center justify-center font-bold cursor-pointer h-11 w-11"
                                    onClick={() =>
                                        setValue("roundCount", Math.min(roundCountWatch + 1, 100))
                                    }
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {hasErrors && (
                    <div className="flex flex-col items-center justify-center gap-8 shadow-lg border border-gray-300 rounded-md p-6">
                        <h2 className="text-2xl text-red-500">
                            Errors! {Object.values(errors)[0]?.message}
                        </h2>
                    </div>
                )}
                <div className="flex flex-col items-center justify-center gap-8 shadow-lg border border-gray-300 rounded-md p-6 w-full">
                    <div className="flex flex-row items-center justify-between gap-4 w-full">
                        <div className="flex flex-row items-center justify-start gap-4">
                            <FiUsers className="w-6 h-6" />
                            <h1 className="text-2xl font-bold">Teams</h1>
                        </div>
                        <button
                            type="button"
                            className="bg-blue-500 text-white p-2 rounded-md px-3 font-bold cursor-pointer flex items-center justify-center gap-2"
                            onClick={addTeam}
                        >
                            <BiPlus className="w-4 h-4" />
                            <span>Add Team</span>
                        </button>
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
                <button
                    type="submit"
                    className="bg-green-600 text-white p-2 rounded-md px-5 py-3 font-bold cursor-pointer flex items-center justify-center gap-2"
                >
                    <BiPlay className="w-6 h-6" />
                    <span>Start Draft</span>
                </button>
            </form>
        </div>
    )
}
