/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, useCallback } from "react"

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

const useHoverMouse = (onHover: (ev: MouseEvent) => void, shouldHover: boolean) => {
    const elementRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        if (shouldHover) {
            const handleClickOutside = (ev: MouseEvent) => {
                if (elementRef?.current?.contains(ev.target as Node)) {
                    onHover(ev)
                }
            }

            document.addEventListener("mouseover", handleClickOutside)

            return () => {
                document.removeEventListener("mouseover", handleClickOutside)
            }
        }
    }, [elementRef, onHover, shouldHover])

    return {
        elementRef,
    }
}

const HackerText = ({
    children,
    hoverAffect = false,
    ipl = 8,
}: {
    children: string
    hoverAffect?: boolean
    ipl?: number
}) => {
    const title = children || "title"

    const [innerText, setInnerText] = useState(title)

    let interval: NodeJS.Timeout

    const hackerize = useCallback(() => {
        let iteration = 0

        clearInterval(interval)

        interval = setInterval(() => {
            const newInnerText = title
                .split("")
                .map((_letter: string, index: number) => {
                    // The iteration is constantly increasing
                    // e.g. If the ipl is 1
                    // this would move the cursor 1 letter each time
                    if (index < iteration) {
                        return title[index]
                    }

                    return letters[Math.floor(Math.random() * 26)]
                })
                .join("")
            setInnerText(newInnerText)

            if (iteration >= title.length) {
                clearInterval(interval)
            }

            // Number of iterations per letter
            iteration += 1 / ipl
        }, 10)
    }, [title])

    useEffect(() => {
        hackerize()
    }, [hackerize])

    const { elementRef } = useHoverMouse(hackerize, hoverAffect)

    return (
        <span ref={elementRef} className="font-mono">
            {innerText}
        </span>
    )
}

export default HackerText
