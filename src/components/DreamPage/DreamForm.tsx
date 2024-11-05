'use client'

import SearchSelectNounTrait from '@/components/SearchSelect/NounTrait'
import { nounTraitLayers } from '@/utils/dto/NounTraitLayer'
import { useContext, useEffect, useState } from 'react'
import Button from '@/components/Button'
import NounTraitsContext from '@/utils/contexts/NounTraitsContext'
import NounTrait from '@/utils/dto/NounTrait'
import { getNounData } from '@nouns/assets'

export default function DreamPageDreamForm() {
    const { accessoryList, backgroundList, bodyList, glassesList, headList } =
        useContext(NounTraitsContext)

    const [form, setForm] = useState({
        accessory: '',
        background: '',
        body: '',
        glasses: '',
        head: '',
    })

    const [seed, setSeed] = useState({
        accessory: 0,
        background: 0,
        body: 0,
        glasses: 0,
        head: 0,
    })

    useEffect(() => {
        setSeed({
            accessory:
                accessoryList.find((a) => a.name === form.accessory)?.seed_id ||
                0,
            background:
                backgroundList.find((b) => b.name === form.background)
                    ?.seed_id || 0,
            body: bodyList.find((b) => b.name === form.body)?.seed_id || 0,
            glasses:
                glassesList.find((g) => g.name === form.glasses)?.seed_id || 0,
            head: headList.find((h) => h.name === form.head)?.seed_id || 0,
        })
    }, [form])

    const randomise = () => {
        const getRandomItem = (list: NounTrait[]) =>
            list[Math.floor(Math.random() * list.length)].name

        setForm({
            accessory: getRandomItem(accessoryList),
            background: getRandomItem(backgroundList),
            body: getRandomItem(bodyList),
            glasses: getRandomItem(glassesList),
            head: getRandomItem(headList),
        })
    }

    useEffect(() => {
        generate()
    }, [seed])

    const [generatedSvg, setGeneratedSvg] = useState('')

    const generate = async () => {
        try {
            const { parts, background } = getNounData(seed)

            parts.forEach((part) => {
                console.log('part:', part.filename, part.data)
            })

            const accessory = accessoryList.find(
                (a) => a.name === form.accessory
            )

            if (accessory) {
                console.log('accessory:', accessory.name, accessory.rle_data)
            }

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

    return (
        <div className="py-4 mx-auto max-w-xs space-y-4">
            {generatedSvg && (
                <div dangerouslySetInnerHTML={{ __html: generatedSvg }} />
            )}

            {nounTraitLayers.map((layer) => (
                <SearchSelectNounTrait
                    key={layer}
                    layer={layer}
                    selected={form[layer]}
                    setSelected={(value) =>
                        setForm({ ...form, [layer]: value || '' })
                    }
                />
            ))}

            <div>
                <Button onClick={randomise}>Randomise</Button>
            </div>

            {/* <Button onClick={generate}>Dream</Button> */}
        </div>
    )
}
