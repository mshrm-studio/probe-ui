import { useMemo } from 'react'
import { isLilNounList } from '@/utils/dto/LilNoun'
import useFetcher from '@/utils/services/useFetcher'

const useLilNounList = () => {
    const { error, fetchData, fetching, response } = useFetcher()

    const list = useMemo(() => {
        const data = response?.data?.data

        return isLilNounList(data) ? data : null
    }, [response])

    const fetchLilNounList = (params?: URLSearchParams): void => {
        fetchData(`/lil-nouns`, params)
    }

    return { error, fetching, fetchLilNounList, lilNounList: list }
}

export default useLilNounList
