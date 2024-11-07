import { useCallback, useMemo } from 'react'
import useFetcher from '@/utils/hooks/useFetcher'
import Project from '@/utils/dto/Project'

const useNounColorList = (project: Project) => {
    const { error, fetchData, fetching, response } = useFetcher()

    const list = useMemo(() => {
        const data = response?.data

        return Array.isArray(data) ? (data as string[]) : null
    }, [response])

    const fetchNounColorList = useCallback(
        (params?: URLSearchParams): void => {
            fetchData(
                project === 'Nouns' ? '/noun-colors' : '/lil-noun-colors',
                params
            )
        },
        [fetchData, project]
    )

    return { error, fetching, fetchNounColorList, nounColorList: list }
}

export default useNounColorList
