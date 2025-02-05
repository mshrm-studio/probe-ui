'use client'

import Form from '@/app/nouns/proposals/create/_components/Form'
import Preview from '@/app/nouns/proposals/create/_components/Preview'
import { NounTraitLayer } from '@/utils/dto/NounTraitLayer'
import { useCallback, useMemo, useState } from 'react'
import styles from '@/app/nouns/proposals/create/_styles/proposal.module.css'
import NounSeed from '@/utils/dto/NounSeed'
import NounTrait from '@/utils/dto/NounTrait'
import useNounTraitList from '@/utils/hooks/useNounTraitList'
import Button from '@/components/Button'

export default function Proposal() {
    const [traitCanvas, setTraitCanvas] = useState<HTMLCanvasElement | null>(
        null
    )
    const [traitFile, setTraitFile] = useState<File | null>(null)
    const [traitLayer, setTraitLayer] = useState<NounTraitLayer>('head')

    const { accessoryList, backgroundList, bodyList, glassesList, headList } =
        useNounTraitList()

    const [seed, setSeed] = useState<NounSeed>({
        accessory: 0,
        background: 0,
        body: 0,
        glasses: 0,
        head: 0,
    })

    const randomTrait = useCallback(
        (list: NounTrait[]) =>
            list[Math.floor(Math.random() * list.length)].seed_id,
        []
    )

    const randomise = () => {
        setSeed({
            accessory: randomTrait(accessoryList),
            background: randomTrait(backgroundList),
            body: randomTrait(bodyList),
            glasses: randomTrait(glassesList),
            head: randomTrait(headList),
        })
    }

    const backgroundColor = useMemo(() => {
        const bg = backgroundList.find((t) => t.seed_id == seed.background)

        return bg ? `#${bg.name}` : '#ffffff'
    }, [backgroundList, seed.background])

    return (
        <div className={styles.pageContainer}>
            <div
                className={styles.image}
                style={{
                    backgroundColor: backgroundColor,
                }}
            >
                <canvas
                    ref={setTraitCanvas}
                    height={32}
                    width={32}
                    className="hidden"
                />

                <Preview
                    seed={seed}
                    traitCanvas={traitCanvas}
                    traitFile={traitFile}
                    traitLayer={traitLayer}
                />

                <div className={styles.randomiseBtnContainer}>
                    <Button color="white" onClick={randomise}>
                        Randomize
                    </Button>
                </div>
            </div>

            <Form
                seed={seed}
                traitCanvas={traitCanvas}
                traitFile={traitFile}
                traitLayer={traitLayer}
                setSeed={setSeed}
                setTraitFile={setTraitFile}
                setTraitLayer={setTraitLayer}
            />
        </div>
    )
}
