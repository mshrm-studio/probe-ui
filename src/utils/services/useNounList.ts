import { useMemo } from 'react'
import { isNounList } from '@/utils/dto/Noun'
import useFetcher from '@/utils/services/useFetcher'
import { ReadonlyURLSearchParams } from 'next/navigation'
import Project from '@/utils/dto/Project'

const useNounList = (project: Project) => {
    const { error, fetchData, fetching, meta, response } = useFetcher()

    const list = useMemo(() => {
        const data = response?.data?.data

        return isNounList(data) ? data : null
    }, [response])

    const fetchNounList = (
        params?: ReadonlyURLSearchParams | URLSearchParams | null
    ): void => {
        fetchData(project === 'Nouns' ? '/nouns' : '/lil-nouns', params)
    }

    return { error, fetching, fetchNounList, nounList: list, meta }
}

export default useNounList
