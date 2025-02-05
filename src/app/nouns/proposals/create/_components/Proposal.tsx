'use client'

import Form from '@/app/nouns/proposals/create/_components/Form'
import Preview from '@/app/nouns/proposals/create/_components/Preview'
import { NounTraitLayer } from '@/utils/dto/NounTraitLayer'
import { useState } from 'react'
import styles from '@/app/nouns/proposals/create/_styles/proposal.module.css'

export default function Proposal() {
    const [traitCanvas, setTraitCanvas] = useState<HTMLCanvasElement | null>(
        null
    )
    const [traitFile, setTraitFile] = useState<File | null>(null)
    const [traitLayer, setTraitLayer] = useState<NounTraitLayer>('head')

    return (
        <div className={styles.pageContainer}>
            <div className={styles.image}>
                <canvas
                    ref={setTraitCanvas}
                    height={32}
                    width={32}
                    className="hidden"
                />

                <Preview
                    traitCanvas={traitCanvas}
                    traitFile={traitFile}
                    traitLayer={traitLayer}
                />
            </div>

            <Form
                traitCanvas={traitCanvas}
                traitFile={traitFile}
                traitLayer={traitLayer}
                setTraitFile={setTraitFile}
                setTraitLayer={setTraitLayer}
            />
        </div>
    )
}
