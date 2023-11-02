import { useMemo } from 'react'
import { isLilNounList } from '@/utils/dto/LilNoun'
import useFetcher from '@/utils/services/useFetcher'
import { ReadonlyURLSearchParams } from 'next/navigation'

const useLilNounList = () => {
    const { error, fetchData, fetching, meta, response } = useFetcher()

    const list = useMemo(() => {
        const data = response?.data?.data

        return isLilNounList(data) ? data : null
    }, [response])

    const fetchLilNounList = (
        params?: ReadonlyURLSearchParams | URLSearchParams | null
    ): void => {
        fetchData(`/lil-nouns`, params)
    }

    return { error, fetching, fetchLilNounList, lilNounList: list, meta }
}

export default useLilNounList
