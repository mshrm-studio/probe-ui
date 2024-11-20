'use client'

import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import StaticAlert from '@/components/StaticAlert'
import Noun, {
    NounListResponse,
    isNounList,
    isNounListResponse,
} from '@/utils/dto/Noun'
import useApi from '@/utils/hooks/v2/useApi'
import { useContext, useEffect, useState } from 'react'
import { debounce } from 'lodash'
import List from '@/app/nouns/_components/List/List'
import Controls from '@/app/nouns/_components/Controls'
import ProjectContext from '@/utils/contexts/ProjectContext'
import FetchingImage from '@/components/FetchingImage'

type Props = {
    fallbackData: NounListResponse
}

export default function Nouns({ fallbackData }: Props) {
    const api = useApi()
    const { apiBaseUrl } = useContext(ProjectContext)
    const searchParams = useSearchParams()
    const [nouns, setNouns] = useState<Noun[]>(fallbackData.data)
    const [query, setQuery] = useState(searchParams.toString())

    useEffect(() => {
        const updateQuery = debounce(() => {
            setQuery(searchParams.toString())
        }, 300)

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

    const { data, error, isLoading } = useSWR(url, fetcher, {
        fallbackData,
        revalidateOnMount: false,
    })

    useEffect(() => {
        if (isNounListResponse(data)) {
            setNouns((prev) => {
                const e = new Set(prev.map((item) => item.token_id))
                const n = data.data.filter((item) => !e.has(item.token_id))
                return [...prev, ...n]
            })
        }
    }, [data])

    if (!isNounList(nouns) || error)
        return <StaticAlert>{error?.message || 'Internal Error'}</StaticAlert>

    return (
        <div className="space-y-4">
            <Controls isLoading={isLoading} meta={data.meta} />

            <List nounList={nouns} />

            {isLoading && <FetchingImage />}
        </div>
    )
}
