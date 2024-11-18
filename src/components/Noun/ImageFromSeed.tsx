'use client'

import DreamNoun, { isDreamNoun } from '@/utils/dto/DreamNoun'
import { getNounData } from '@nouns/assets'
import { useEffect, useState } from 'react'
import styles from '@/styles/nounImage/fromSeed.module.css'
import NounSeed from '@/utils/dto/NounSeed'

type Props = {
    seed: NounSeed | DreamNoun
}

const NounImageFromSeed: React.FC<Props> = ({ seed }) => {
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

            if (!response.ok) throw new Error('Failed to generate SVG')

            const { svg } = await response.json()

            setGeneratedSvg(svg)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        generate()
    }, [seed])

    return (
        <div
            className={styles.svgContainer}
            dangerouslySetInnerHTML={{ __html: generatedSvg }}
        />
    )
}

export default NounImageFromSeed
