'use client'
import React, { useState } from 'react'
import LilNoun from '@/utils/dto/LilNoun'
import LilNounImage from '@/components/LilNounImage'

type Props = {
    lilNouns: LilNoun[]
    setSelected: React.Dispatch<LilNoun>
}

const LilNounList: React.FC<Props> = ({ lilNouns, setSelected }) => {
    return (
        <ul className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {lilNouns.map((lilNoun) => (
                <li
                    key={lilNoun.token_id}
                    className="border-2 border-transparent"
                    onClick={() => setSelected(lilNoun)}
                >
                    <LilNounImage className="rounded" lilNoun={lilNoun} />
                </li>
            ))}
        </ul>
    )
}

export default LilNounList
