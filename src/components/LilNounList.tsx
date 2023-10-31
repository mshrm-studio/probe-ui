'use client'
import React from 'react'
import LilNoun from '@/utils/dto/LilNoun'
import LilNounImage from '@/components/LilNounImage'

type Props = {
    lilNouns: LilNoun[]
    selected: LilNoun | null
    updateSelected: (selected: LilNoun) => void
}

const LilNounList: React.FC<Props> = ({
    lilNouns,
    selected,
    updateSelected,
}) => {
    return (
        <ul
            className={`grid gap-2 grid-cols-3 md:grid-cols-5 lg:grid-cols-6 ${
                selected
                    ? 'xl:grid-cols-8 xl:max-w-[936px]'
                    : 'xl:grid-cols-10 xl:max-w-[1159px]'
            }`}
        >
            {lilNouns.map((lilNoun) => (
                <li
                    key={lilNoun.token_id}
                    className={`border-2 rounded ${
                        selected?.token_id == lilNoun.token_id
                            ? 'border-black'
                            : 'border-transparent'
                    }`}
                    onClick={() => updateSelected(lilNoun)}
                >
                    <LilNounImage lilNoun={lilNoun} />
                </li>
            ))}
        </ul>
    )
}

export default LilNounList
