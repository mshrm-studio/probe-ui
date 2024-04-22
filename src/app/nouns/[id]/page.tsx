'use client'

import NounPage from '@/components/NounPage/NounPage'

export default function Page({ params }: { params: { id: number } }) {
    return <NounPage project="Nouns" nounId={params.id} />
}
