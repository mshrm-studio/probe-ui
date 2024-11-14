'use client'

import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import StaticAlert from '@/components/StaticAlert'
import { isDreamNounListResponse } from '@/utils/dto/DreamNoun'
import useApi from '@/utils/hooks/v2/useApi'
import NounImageFromSeed from '@/components/Noun/ImageFromSeed'
import EthAddress from '@/components/EthAddress'
import FetchingImage from '@/components/FetchingImage'
import { useEffect, useState } from 'react'
import { debounce } from 'lodash'

export default function DreamList() {
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

    if (data.data.length === 0) return <p>No nouns match query.</p>

    return (
        <ul className="grid gap-2 grid-cols-4 xl:grid-cols-12">
            {data.data.map((dream) => (
                <li key={dream.id} className="space-y-2 text-xs">
                    <NounImageFromSeed seed={dream} />

                    <div>
                        <EthAddress address={dream.dreamer} />
                    </div>
                </li>
            ))}
        </ul>
    )
}
