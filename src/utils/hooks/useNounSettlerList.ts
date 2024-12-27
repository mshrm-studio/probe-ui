import { useCallback, useMemo } from 'react'
import useFetcher from '@/utils/hooks/useFetcher'
import Project from '@/utils/dto/Project'

const useNounSettlerList = (project: Project) => {
    const { error, fetchData, fetching, response } = useFetcher()

    const list = useMemo(() => {
        const data = response?.data

        return Array.isArray(data) ? (data as string[]) : null
    }, [response])

    const fetchNounSettlerList = useCallback(
        (params?: URLSearchParams): void => {
            fetchData(
                project === 'Nouns' ? '/noun-settlers' : '/lil-noun-settlers',
                params
            )
        },
        [fetchData, project]
    )

    return { error, fetching, fetchNounSettlerList, nounSettlerList: list }
}

export default useNounSettlerList
