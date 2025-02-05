'use client'

import { NounBitmap } from '@/components/Noun/Bitmap'
import NounSeed from '@/utils/dto/NounSeed'
import { NounTraitLayer } from '@/utils/dto/NounTraitLayer'
import useImageBitmap from '@/utils/hooks/useImageBitmap'

interface Props {
    seed: NounSeed
    traitCanvas: HTMLCanvasElement | null
    traitFile: File | null
    traitLayer: NounTraitLayer
}

const Preview: React.FC<Props> = ({
    seed,
    traitCanvas,
    traitFile,
    traitLayer,
}) => {
    const traitBitmap = useImageBitmap(traitCanvas, traitFile)

    return (
        <NounBitmap
            accessory={
                traitLayer === 'accessory' && traitBitmap
                    ? traitBitmap
                    : seed.accessory
            }
            background={seed.background}
            body={
                traitLayer === 'body' && traitBitmap ? traitBitmap : seed.body
            }
            glasses={
                traitLayer === 'glasses' && traitBitmap
                    ? traitBitmap
                    : seed.glasses
            }
            head={
                traitLayer === 'head' && traitBitmap ? traitBitmap : seed.head
            }
        />
    )
}

export default Preview
