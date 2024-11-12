'use client'

import DreamNoun from '@/utils/dto/DreamNoun'
import { getNounData } from '@nouns/assets'
import { useEffect, useState } from 'react'

type Props = {
    dreamNoun: DreamNoun
}

const NounImageFromSeed: React.FC<Props> = ({ dreamNoun }) => {
    const [generatedSvg, setGeneratedSvg] = useState('')

    const generate = async () => {
        try {
            const seed = {
                accessory: dreamNoun.accessory_seed_id || 0,
                background: dreamNoun.background_seed_id || 0,
                body: dreamNoun.body_seed_id || 0,
                glasses: dreamNoun.glasses_seed_id || 0,
                head: dreamNoun.head_seed_id || 0,
            }

            const { parts, background } = getNounData(seed)

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
            alert(error)
        }
    }

    useEffect(() => {
        generate()
    }, [dreamNoun])

    return <div dangerouslySetInnerHTML={{ __html: generatedSvg }} />
}

export default NounImageFromSeed
