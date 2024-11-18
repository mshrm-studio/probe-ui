'use client'

import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import StaticAlert from '@/components/StaticAlert'
import { isDreamNounListResponse } from '@/utils/dto/DreamNoun'
import useApi from '@/utils/hooks/v2/useApi'
import FetchingImage from '@/components/FetchingImage'
import { useEffect, useState } from 'react'
import { debounce } from 'lodash'
import List from '@/app/nouns/dreams/_components/List'

export default function Dreams() {
    const api = useApi()
    const searchParams = useSearchParams()
    const [queryString, setQueryString] = useState(searchParams.toString())

    useEffect(() => {
        const updateQueryString = debounce(() => {
            setQueryString(searchParams.toString())
        }, 300)

        updateQueryString()

        return () => {
            updateQueryString.cancel()
        }
    }, [searchParams])

    const fetcher = async (url: string) => {
        const response = await api.get(url)

        return response.data
    }

    const url = queryString ? `/dream-nouns?${queryString}` : '/dream-nouns'

    const { data, error, isLoading } = useSWR(url, fetcher)

    if (isLoading) return <FetchingImage />

    if (!isDreamNounListResponse(data) || error)
        return <StaticAlert>{error?.message || 'Unknown Error'}</StaticAlert>

    return <List list={data.data} />
}
