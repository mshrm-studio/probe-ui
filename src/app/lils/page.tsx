'use client'

import NounListPage from '@/components/NounListPage/NounListPage'
import DimensionsProvider from '@/components/DimensionsProvider'

export default function Page() {
    return (
        <DimensionsProvider>
            <NounListPage project="LilNouns" />
        </DimensionsProvider>
    )
}
