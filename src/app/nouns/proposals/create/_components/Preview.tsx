'use client'

import { NounBitmap } from '@/components/Noun/Bitmap'
import { NounTraitLayer } from '@/utils/dto/NounTraitLayer'
import useImageBitmap from '@/utils/hooks/useImageBitmap'

interface Props {
    traitCanvas: HTMLCanvasElement | null
    traitFile: File | null
    traitLayer: NounTraitLayer
}

const Preview: React.FC<Props> = ({ traitCanvas, traitFile, traitLayer }) => {
    const traitBitmap = useImageBitmap(traitCanvas, traitFile)

    if (!traitCanvas || !traitFile || !traitBitmap) return null

    return (
        <NounBitmap
            accessory={
                traitLayer === 'accessory' && traitBitmap ? traitBitmap : 0
            }
            background={0}
            body={traitLayer === 'body' && traitBitmap ? traitBitmap : 0}
            glasses={traitLayer === 'glasses' && traitBitmap ? traitBitmap : 0}
            head={traitLayer === 'head' && traitBitmap ? traitBitmap : 0}
        />
    )
}

export default Preview
