import { useEffect, useState } from 'react'
import { useTraitBitMap } from '@/utils/hooks/useTraitBitMap'

interface Props {
    glasses: number | ImageBitmap
    head: number | ImageBitmap
    accessory: number | ImageBitmap
    body: number | ImageBitmap
    background: string
    margin?: number
    size: number
    circleCrop?: boolean
}

export const NounBitMap: React.FC<Props> = ({
    glasses,
    head,
    accessory,
    body,
    background,
    size,
    circleCrop = false,
    margin = 0,
}) => {
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)

    const glassesBitmap = useTraitBitMap('glasses', glasses)
    const headBitmap = useTraitBitMap('heads', head)
    const accessoryBitmap = useTraitBitMap('accessories', accessory)
    const bodyBitmap = useTraitBitMap('bodies', body)

    // Draw on canvas when bitmaps are ready
    useEffect(() => {
        if (
            !canvas ||
            !bodyBitmap ||
            !accessoryBitmap ||
            !headBitmap ||
            !glassesBitmap
        )
            return

        canvas.width = size + margin * 2
        canvas.height = size + margin * 2

        const ctx = canvas.getContext('2d')!
        ctx.imageSmoothingEnabled = false
        ctx.clearRect(margin, margin, size, size)
        ctx.fillStyle = background
        ctx.fillRect(margin, margin, size, size)

        // Draw images once all bitmaps are loaded
        ctx.drawImage(bodyBitmap, margin, margin, size, size)
        ctx.drawImage(accessoryBitmap, margin, margin, size, size)
        ctx.drawImage(headBitmap, margin, margin, size, size)
        ctx.drawImage(glassesBitmap, margin, margin, size, size)

        if (circleCrop) {
            ctx.globalCompositeOperation = 'destination-in'
            ctx.beginPath()
            ctx.arc(
                canvas.width / 2,
                canvas.height / 2,
                size / 2,
                0,
                Math.PI * 2
            )
            ctx.closePath()
            ctx.fill()
            ctx.globalCompositeOperation = 'source-over'
        }
    }, [
        margin,
        canvas,
        glassesBitmap,
        headBitmap,
        accessoryBitmap,
        bodyBitmap,
        circleCrop,
        background,
        size,
    ])

    return <canvas ref={setCanvas} />
}
