'use client'

import NounTrait from '@/utils/dto/NounTrait'
import NounTraitsContext from '@/utils/contexts/NounTraitsContext'

type Props = {
    children: React.ReactNode
    traits: {
        accessoryList: NounTrait[]
        backgroundList: NounTrait[]
        bodyList: NounTrait[]
        glassesList: NounTrait[]
        headList: NounTrait[]
    }
}

export default function NounTraitsProvider({ children, traits }: Props) {
    return (
        <NounTraitsContext.Provider value={traits}>
            {children}
        </NounTraitsContext.Provider>
    )
}
