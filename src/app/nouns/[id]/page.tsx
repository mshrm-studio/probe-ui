'use client'

import NounPage from '@/components/NounPage/NounPage'
import DimensionsProvider from '@/components/DimensionsProvider'

export default function Page({ params }: { params: { id: number } }) {
    return (
        <DimensionsProvider>
            <NounPage project="Nouns" nounId={params.id} />
        </DimensionsProvider>
    )
}
