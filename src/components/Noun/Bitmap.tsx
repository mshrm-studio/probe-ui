'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTraitBitmap } from '@/utils/hooks/useTraitBitmap'
import useNounTraitList from '@/utils/hooks/useNounTraitList'

interface Props {
    accessory: number | ImageBitmap | string
    background: number | string
    body: number | ImageBitmap | string
    circleCrop?: boolean
    glasses: number | ImageBitmap | string
    head: number | ImageBitmap | string
    margin?: number
    size?: number
}

export const NounBitmap: React.FC<Props> = ({
    accessory,
    background,
    body,
    circleCrop = false,
    glasses,
    head,
    margin = 0,
    size,
}) => {
    const { backgroundList } = useNounTraitList()

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [inheritedSize, setInheritedSize] = useState<number | null>(null)

    const glassesBitmap = useTraitBitmap('glasses', glasses)
    const headBitmap = useTraitBitmap('heads', head)
    const accessoryBitmap = useTraitBitmap('accessories', accessory)
    const bodyBitmap = useTraitBitmap('bodies', body)

    // Get size from parent if size is not provided
    useEffect(() => {
        if (!size && canvasRef.current) {
            // Observe parent element size
            const observer = new ResizeObserver(([entry]) => {
                const parentHeight = entry.contentRect.height
                const parentWidth = entry.contentRect.width
                setInheritedSize(Math.min(parentHeight, parentWidth))
            })

            observer.observe(canvasRef.current.parentElement!) // Observe parent size

            return () => observer.disconnect() // Cleanup observer
        }
    }, [size])

    const canvasSize = useMemo(() => {
        return size || inheritedSize || 100
    }, [inheritedSize, size])

    const backgroundColor = useMemo(() => {
        if (typeof background === 'string') return background

        const bg = backgroundList.find((t) => t.seed_id == background)

        return bg ? `#${bg.name}` : '#ffffff'
    }, [backgroundList, background])

    // Draw on canvas when bitmaps are ready
    useEffect(() => {
        const canvas = canvasRef.current

        if (!canvas) return

        const ctx = canvas.getContext('2d')!

        if (!accessoryBitmap || !bodyBitmap || !headBitmap || !glassesBitmap) {
            canvas.style.width = '100%'
            canvas.style.height = '100%'
            ctx.clearRect(0, 0, canvas.width, canvas.height) // Clear any existing content
            return
        }

        canvas.style.width = ''
        canvas.style.height = ''
        canvas.width = canvasSize + margin * 2
        canvas.height = canvasSize + margin * 2

        ctx.imageSmoothingEnabled = false
        ctx.clearRect(margin, margin, canvasSize, canvasSize)
        ctx.fillStyle = backgroundColor
        ctx.fillRect(margin, margin, canvasSize, canvasSize)

        // Draw images once all bitmaps are loaded
        ctx.drawImage(bodyBitmap, margin, margin, canvasSize, canvasSize)
        ctx.drawImage(accessoryBitmap, margin, margin, canvasSize, canvasSize)
        ctx.drawImage(headBitmap, margin, margin, canvasSize, canvasSize)
        ctx.drawImage(glassesBitmap, margin, margin, canvasSize, canvasSize)

        if (circleCrop) {
            ctx.globalCompositeOperation = 'destination-in'
            ctx.beginPath()
            ctx.arc(
                canvas.width / 2,
                canvas.height / 2,
                canvasSize / 2,
                0,
                Math.PI * 2
            )
            ctx.closePath()
            ctx.fill()
            ctx.globalCompositeOperation = 'source-over'
        }
    }, [
        accessoryBitmap,
        backgroundColor,
        bodyBitmap,
        canvasRef,
        canvasSize,
        circleCrop,
        headBitmap,
        glassesBitmap,
        margin,
    ])

    return <canvas ref={canvasRef} />
}
