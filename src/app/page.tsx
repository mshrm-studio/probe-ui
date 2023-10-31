'use client'
import LilNounFilters from '@/components/LilNounFilters'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { debounce } from 'lodash'
import useLilNounList from '@/utils/services/useLilNounList'
import LilNounList from '@/components/LilNounList'
import LilNoun from '@/utils/dto/LilNoun'

export default function Home() {
    const { error, fetching, fetchLilNounList, lilNounList } = useLilNounList()

    const searchParams = useSearchParams()

    useEffect(() => {
        const debouncedFetch = debounce(() => {
            console.log('debouncedFetch', searchParams.toString())
            fetchLilNounList(searchParams)
        }, 500)

        debouncedFetch()

        return () => debouncedFetch.cancel()
    }, [searchParams])

    const [selected, setSelected] = useState<LilNoun | null>(null)

    return (
        <main className="space-y-3">
            <LilNounFilters />

            {lilNounList && (
                <LilNounList lilNouns={lilNounList} setSelected={setSelected} />
            )}
        </main>
    )
}
