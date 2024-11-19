'use client'

import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import StaticAlert from '@/components/StaticAlert'
import { NounListResponse, isNounListResponse } from '@/utils/dto/Noun'
import useApi from '@/utils/hooks/v2/useApi'
import { useContext, useEffect, useState } from 'react'
import { debounce } from 'lodash'
import List from '@/app/nouns-new/_components/List/List'
import ProjectContext from '@/utils/contexts/ProjectContext'

type Props = {
    fallbackData: NounListResponse
}

export default function Nouns({ fallbackData }: Props) {
    const api = useApi()
    const { apiBaseUrl } = useContext(ProjectContext)
    const searchParams = useSearchParams()
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

    const { data, error } = useSWR(url, fetcher, {
        fallbackData,
        revalidateOnMount: false,
    })

    if (!isNounListResponse(data) || error)
        return <StaticAlert>{error?.message || 'Internal Error'}</StaticAlert>

    return <List nounList={data.data} />
}
