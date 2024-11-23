'use client'

import DreamNoun, { isDreamNoun } from '@/utils/dto/DreamNoun'
import { getNounData } from '@nouns/assets'
import { useEffect, useState } from 'react'
import styles from '@/styles/nounImage/fromSeed.module.css'
import NounSeed from '@/utils/dto/NounSeed'
import Noun, { isNoun } from '@/utils/dto/Noun'
import NounImage from '@/components/Noun/Image'

type Props = {
    seed: NounSeed | DreamNoun | Noun
}

const NounImageFromSeed: React.FC<Props> = ({ seed }) => {
    const [failed, setFailed] = useState(false)
    const [generatedSvg, setGeneratedSvg] = useState('')

    const generate = async () => {
        try {
            const data = isDreamNoun(seed)
                ? {
                      accessory: seed.accessory_seed_id || 0,
                      background: seed.background_seed_id || 0,
                      body: seed.body_seed_id || 0,
                      glasses: seed.glasses_seed_id || 0,
                      head: seed.head_seed_id || 0,
                  }
                : isNoun(seed)
                ? {
                      accessory: seed.accessory_index,
                      background: seed.background_index,
                      body: seed.body_index,
                      glasses: seed.glasses_index,
                      head: seed.head_index,
                  }
                : seed

            const { parts, background } = getNounData(data)

            const response = await fetch('/api/build-svg', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    RLE_PARTS: parts,
                    BACKGROUND_COLOR: background,
                }),
            })

            if (!response.ok) {
                setFailed(true)
                throw new Error('Failed to generate SVG')
            }

            const { svg } = await response.json()

            setGeneratedSvg(svg)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        generate()
    }, [seed])

    if (failed && isNoun(seed)) {
        return <NounImage className="w-full h-full" noun={seed} />
    }

    return (
        <div
            className={styles.svgContainer}
            dangerouslySetInnerHTML={{ __html: generatedSvg }}
        />
    )
}

export default NounImageFromSeed
