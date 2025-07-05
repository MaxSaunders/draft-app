import { useState } from "react"
import { X } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import CellDialogue, { InputForm } from "./cellDialogue"

type ImageCellProps = {
    keyString: string
    index: number
    overallIndex: number
    teamOwner: string
    color: string
    borderColor: string
    fadedColor: string
    isActive: boolean
    onSuccess: () => void
    className?: string
}

const ImageCell = ({
    keyString,
    index,
    overallIndex,
    teamOwner,
    color,
    borderColor,
    fadedColor,
    isActive,
    onSuccess,
    className,
}: ImageCellProps) => {
    // const [image, setImage] = useLocalStorage<string | null>(`image-${keyString}`, null)
    const [title, setTitle] = useState<string | null>(null)
    const [image, setImage] = useState<string | null>(null)
    const [isDialogueOpen, setIsDialogueOpen] = useState(false)

    const reset = () => {
        setImage(null)
        setTitle(null)
    }

    const handleClose = (data: InputForm) => {
        setImage(data.imgUrl)
        setTitle(data.title)
        setIsDialogueOpen(false)
        onSuccess()
    }

    if (image) {
        return (
            <div
                key={keyString}
                className={cn(
                    "w-full h-full rounded-xl overflow-hidden relative",
                    `border-4 ${borderColor}`,
                    className
                )}
            >
                <div className="absolute top-1 left-1 bg-slate-900/75 rounded-full h-8 w-8 flex items-center justify-center text-white text-lg font-bold">
                    {overallIndex + 1}
                </div>

                <Button
                    type="button"
                    className="absolute w-6 h-6 rounded right-2 top-2 bg-red-400/50 border border-red-500/25 cursor-pointer hover:bg-red-300/25 hover:border-red-500/50"
                    onClick={reset}
                >
                    <X className="w-6 h-6" />
                </Button>
                <Image
                    src={image}
                    onError={() => {
                        console.error("Image failed to load:", image)
                        reset()
                    }}
                    alt="Draft pick image"
                    className="object-contain w-full h-full"
                    width={100}
                    height={100}
                    onLoadingComplete={(result) => {
                        if (result.naturalWidth === 0) {
                            console.error("Image has zero width:", image)
                            reset()
                        }
                    }}
                />
                <div className="absolute flex items-center justify-center font-bold bottom-0 left-0 right-0 p-2 bg-black/75 text-white text-sm">
                    {title}
                </div>
            </div>
        )
    }

    return (
        <>
            <CellDialogue
                isOpen={isDialogueOpen}
                close={() => setIsDialogueOpen(false)}
                onClose={handleClose}
            />
            <Card
                key={keyString}
                className={cn(
                    "w-full border-2 border-dashed border-slate-200 transition-colors",
                    isActive &&
                        `border-2 border-dashed ${borderColor} ${fadedColor} hover:border-slate-600 cursor-pointer`,
                    // isActive &&
                    //     "border-2 border-dashed border-slate-400 hover:border-slate-600 cursor-pointer",
                    className
                )}
                onClick={() => isActive && setIsDialogueOpen(true)}
            >
                <CardContent className="flex items-center justify-center h-32">
                    <div className="text-center text-slate-500">
                        <div className="text-lg font-semibold mb-1">Pick {index + 1}</div>
                        <div className="text-sm">{teamOwner || `Team ${index + 1}`}</div>
                        <div className="mt-2">
                            <div
                                className={`w-4 h-4 rounded-full mx-auto ${color || "slate-300"}`}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default ImageCell
