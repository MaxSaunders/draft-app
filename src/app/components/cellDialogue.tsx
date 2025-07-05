"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { BiPaste } from "react-icons/bi"
import { z } from "zod"

const InputForm = z.object({
    title: z.string().min(1),
    imgUrl: z
        .string()
        .url()
        .refine((url) => {
            return new Promise((resolve) => {
                const img = new window.Image()
                img.onload = () => resolve(true)
                img.onerror = () => resolve(false)
                img.src = url
            })
        }, "Invalid image URL"),
})

export type InputForm = z.infer<typeof InputForm>

type CellDialogueProps = {
    isOpen: boolean
    close: () => void
    onClose: (data: InputForm) => void
}

const CellDialogue = ({ isOpen, close, onClose }: CellDialogueProps) => {
    const form = useForm<z.infer<typeof InputForm>>({
        resolver: zodResolver(InputForm),
        defaultValues: {
            title: "",
            imgUrl: "",
        },
    })

    if (!isOpen) {
        return null
    }

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Enter Pick Details</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onClose)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="imgUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URL</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                className="px-3 py-2 border rounded-md hover:bg-gray-100"
                                                onClick={async () => {
                                                    try {
                                                        const text =
                                                            await navigator.clipboard.readText()
                                                        field.onChange(text)
                                                    } catch (err) {
                                                        console.error(
                                                            "Failed to read clipboard:",
                                                            err
                                                        )
                                                        alert(
                                                            "Failed to read clipboard. Please try again."
                                                        )
                                                    }
                                                }}
                                            >
                                                <BiPaste className="w-4 h-4" />
                                            </button>
                                            <Input {...field} />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-between">
                            <Button type="button" variant="outline" onClick={close}>
                                Cancel
                            </Button>
                            <Button type="submit">Submit</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CellDialogue
