import { useMemo } from 'react'
import { isLilNounTraitList } from '@/utils/dto/LilNounTrait'
import useFetcher from '@/utils/services/useFetcher'

const useLilNounList = () => {
    const { error, fetchData, fetching, response } = useFetcher()

    const list = useMemo(() => {
        const data = response?.data

        return isLilNounTraitList(data) ? data : null
    }, [response])

    const fetchLilNounTraitList = (params?: URLSearchParams): void => {
        fetchData(`/traits`, params)
    }

    return { error, fetching, fetchLilNounTraitList, lilNounTraitList: list }
}

export default useLilNounList
