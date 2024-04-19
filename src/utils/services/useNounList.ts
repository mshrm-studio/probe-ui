import { useCallback, useMemo } from 'react'
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

    const fetchNounList = useCallback(
        (params?: ReadonlyURLSearchParams | URLSearchParams | null): void => {
            console.log(
                'useNounList fetchNounList, params:',
                params?.toString() || 'none'
            )
            fetchData(project === 'Nouns' ? '/nouns' : '/lil-nouns', params)
        },
        [fetchData, project]
    )

    return { error, fetching, fetchNounList, nounList: list, meta }
}

export default useNounList
