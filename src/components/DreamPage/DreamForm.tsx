'use client'

import SearchSelectNounTrait from '@/components/SearchSelect/NounTrait'
import { nounTraitLayers } from '@/utils/dto/NounTraitLayer'
import { FormEvent, useContext, useEffect, useState } from 'react'
import Button from '@/components/Button'
import NounTraitsContext from '@/utils/contexts/NounTraitsContext'
import NounTrait from '@/utils/dto/NounTrait'
import { getNounData } from '@nouns/assets'
import styles from '@/utils/styles/nouns/dreams/create.module.css'

export default function DreamPageDreamForm() {
    const { accessoryList, backgroundList, bodyList, glassesList, headList } =
        useContext(NounTraitsContext)

    const randomTraitName = (list: NounTrait[]) =>
        list[Math.floor(Math.random() * list.length)].name

    const [form, setForm] = useState({
        accessory: randomTraitName(accessoryList),
        background: randomTraitName(backgroundList),
        body: randomTraitName(bodyList),
        glasses: randomTraitName(glassesList),
        head: randomTraitName(headList),
    })

    useEffect(() => {
        const accessory = accessoryList.find((a) => a.name === form.accessory),
            background = backgroundList.find((b) => b.name === form.background),
            body = bodyList.find((b) => b.name === form.body),
            glasses = glassesList.find((g) => g.name === form.glasses),
            head = headList.find((h) => h.name === form.head)

        if (!accessory || !background || !body || !glasses || !head) return

        setSeed({
            accessory: accessory.seed_id,
            background: background.seed_id,
            body: body.seed_id,
            glasses: glasses.seed_id,
            head: head.seed_id,
        })
    }, [form])

    const [seed, setSeed] = useState({
        accessory: 0,
        background: 0,
        body: 0,
        glasses: 0,
        head: 0,
    })

    useEffect(() => {
        generate()
    }, [seed])

    const [generatedSvg, setGeneratedSvg] = useState('')

    const generate = async () => {
        try {
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

    const dream = (e: FormEvent) => {
        e.preventDefault()

        alert('Dreaming...')
    }

    return (
        <div className={styles.pageContainer}>
            {generatedSvg && (
                <div
                    className={styles.image}
                    style={{ backgroundColor: `#${form.background}` }}
                >
                    <div
                        className={styles.generatedSvgContainer}
                        dangerouslySetInnerHTML={{ __html: generatedSvg }}
                    />
                </div>
            )}

            <div className={styles.formContainer}>
                <form className={styles.form} onSubmit={dream}>
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

                    <Button nativeType="submit">Dream</Button>
                </form>
            </div>
        </div>
    )
}
