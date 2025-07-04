import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { X } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

type ImageCellProps = {
    keyString: string
    index: number
    teamOwner: string
    color: string
    isActive: boolean
    onSuccess: () => void
    className?: string
}

const ImageCell = ({
    keyString,
    index,
    teamOwner,
    color,
    isActive,
    onSuccess,
    className,
}: ImageCellProps) => {
    // const [image, setImage] = useLocalStorage<string | null>(`image-${keyString}`, null)
    const [image, setImage] = useState<string | null>(null)

    const reset = () => {
        setImage(null)
    }

    const validateImageUrl = async (url: string): Promise<boolean> => {
        return new Promise((resolve) => {
            const img = new window.Image()
            img.onload = () => resolve(true)
            img.onerror = () => resolve(false)
            img.src = url
        })
    }

    const handleClick = async () => {
        if (!isActive) {
            return
        }

        try {
            const clipboardText = await navigator.clipboard.readText()

            // Basic URL validation
            if (!clipboardText.startsWith("http")) {
                alert("Please copy a valid image URL")
                return
            }

            // Validate the image URL
            const isValid = await validateImageUrl(clipboardText)
            if (!isValid) {
                alert("Invalid image URL. Please try again.")
                return
            }

            setImage(clipboardText)
            onSuccess()
        } catch (err) {
            console.error("Failed to read clipboard:", err)
            alert("Failed to read clipboard. Please try again.")
        }
    }

    if (image) {
        return (
            <div
                key={keyString}
                className={cn("w-full h-full rounded-xl overflow-hidden relative", className)}
            >
                <button
                    type="button"
                    className="absolute w-6 h-6 rounded right-2 top-2 bg-red-200 border border-red-500 cursor-pointer"
                    onClick={reset}
                >
                    <X className="w-6 h-6" />
                </button>
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
            </div>
        )
    }

    return (
        <Card
            key={keyString}
            className={cn(
                "w-full border-2 border-dashed border-slate-200 transition-colors",
                isActive &&
                    "border-2 border-dashed border-slate-400 hover:border-slate-600 cursor-pointer",
                className
            )}
            onClick={handleClick}
        >
            <CardContent className="flex items-center justify-center h-32">
                <div className="text-center text-slate-500">
                    <div className="text-lg font-semibold mb-1">Pick {index + 1}</div>
                    <div className="text-sm">{teamOwner || `Team ${index + 1}`}</div>
                    <div className="mt-2">
                        <div
                            className={`w-4 h-4 rounded-full mx-auto ${color || "bg-slate-300"}`}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ImageCell
