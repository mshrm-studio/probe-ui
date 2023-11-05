'use client'
import React from 'react'
import Noun from '@/utils/dto/Noun'
import NounImage from '@/components/Noun/Image'

type Props = {
    nouns: Noun[]
    selected: Noun | null
    updateSelected: (selected: Noun) => void
}

const NounList: React.FC<Props> = ({ nouns, selected, updateSelected }) => {
    return (
        <ul
            className={`grid gap-2 grid-cols-3 md:grid-cols-6 lg:grid-cols-8 ${
                selected
                    ? 'xl:grid-cols-8 xl:max-w-[936px]'
                    : 'xl:grid-cols-10 xl:max-w-[1159px]'
            }`}
        >
            {nouns.map((noun) => (
                <li
                    key={noun.token_id}
                    className={`border-2 rounded ${
                        selected?.token_id == noun.token_id
                            ? 'border-black'
                            : 'border-transparent'
                    }`}
                    onClick={() => updateSelected(noun)}
                >
                    <NounImage className="rounded" noun={noun} />
                </li>
            ))}
        </ul>
    )
}

export default NounList
