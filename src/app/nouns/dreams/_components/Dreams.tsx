'use client'

import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import StaticAlert from '@/components/StaticAlert'
import {
    DreamNounListResponse,
    isDreamNounListResponse,
} from '@/utils/dto/DreamNoun'
import useApi from '@/utils/hooks/v2/useApi'
import FetchingImage from '@/components/FetchingImage'
import { useEffect, useState } from 'react'
import { debounce } from 'lodash'
import List from '@/app/nouns/dreams/_components/List'

type Props = {
    fallbackData: DreamNounListResponse
}

export default function Dreams({ fallbackData }: Props) {
    const api = useApi()
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

    const url = query ? `/dream-nouns?${query}` : '/dream-nouns'

    const { data, error, isLoading } = useSWR(url, fetcher, {
        fallbackData,
        revalidateOnMount: false,
    })

    if (isLoading) return <FetchingImage />

    if (!isDreamNounListResponse(data) || error)
        return <StaticAlert>{error?.message || 'Internal Error'}</StaticAlert>

    return <List list={data.data} />
}
