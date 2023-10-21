'use client'
import LilNounFilters from '@/components/LilNounFilters'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { debounce } from 'lodash'
import useLilNounList from '@/utils/hooks/useLilNounList'
import LilNounList from '@/components/LilNounList'
import LilNoun from '@/utils/dto/LilNoun'

export default function Home() {
    const { error, fetching, list, fetchLilNounList } = useLilNounList()

    const searchParams = useSearchParams()

    useEffect(() => {
        const debouncedFetch = debounce(() => {
            fetchLilNounList(searchParams)
        }, 500)

        debouncedFetch()

        return () => debouncedFetch.cancel()
    }, [searchParams])

    const [selected, setSelected] = useState<LilNoun | null>(null)

    return (
        <main className="space-y-3">
            {fetching && <div>Fetching...</div>}

            {error && (
                <div>
                    {error.status}: {error.data.message}
                </div>
            )}

            <LilNounFilters />

            {selected && <div>Selected: {selected.token_id}</div>}

            {list && <LilNounList lilNouns={list} setSelected={setSelected} />}
        </main>
    )
}
