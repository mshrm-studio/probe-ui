'use client'

import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import StaticAlert from '@/components/StaticAlert'
import Noun, { isNounListResponse } from '@/utils/dto/Noun'
import useApi from '@/utils/hooks/v2/useApi'
import { useContext, useEffect, useState } from 'react'
import { debounce } from 'lodash'
import List from '@/app/nouns/_components/List/List'
import Controls from '@/app/nouns/_components/Controls'
import ProjectContext from '@/utils/contexts/ProjectContext'
import FetchingImage from '@/components/FetchingImage'

export default function Nouns() {
    const api = useApi()
    const { project, apiBaseUrl } = useContext(ProjectContext)
    const searchParams = useSearchParams()
    const [nouns, setNouns] = useState<Noun[]>([])
    const [query, setQuery] = useState(searchParams.toString())

    useEffect(() => {
        const updateQuery = debounce(() => {
            setQuery(searchParams.toString())
        }, 250)

        updateQuery()

        return () => {
            updateQuery.cancel()
        }
    }, [searchParams])

    const fetcher = async (url: string) => {
        const { data } = await api.get(url)

        return data
    }

    const url = query ? `${apiBaseUrl}?${query}` : apiBaseUrl

    const { data, error, isLoading, isValidating } = useSWR(url, fetcher)

    useEffect(() => {
        if (isNounListResponse(data)) {
            if (data.meta.current_page === 1) {
                setNouns(data.data)
            } else {
                setNouns((prev) => {
                    const e = new Set(prev.map((item) => item.token_id))
                    const n = data.data.filter((item) => !e.has(item.token_id))
                    return [...prev, ...n]
                })
            }
        }
    }, [data])

    if (error)
        return <StaticAlert>{error?.message || 'Internal Error'}</StaticAlert>

    return (
        <div className="space-y-4">
            {isNounListResponse(data) && (
                <Controls
                    isLoading={isLoading || isValidating}
                    meta={data.meta}
                />
            )}

            <List nounList={nouns} />

            {isLoading || isValidating ? (
                <FetchingImage />
            ) : (
                <p className="text-center text-xs">
                    {nouns.length} {project === 'LilNouns' ? 'Lils' : 'Nouns'}
                </p>
            )}
        </div>
    )
}
