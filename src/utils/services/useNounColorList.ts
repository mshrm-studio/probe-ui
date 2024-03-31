import { useMemo } from 'react'
import useFetcher from '@/utils/services/useFetcher'
import Project from '@/utils/dto/Project'

const useNounColorList = (project: Project) => {
    const { error, fetchData, fetching, response } = useFetcher()

    const list = useMemo(() => {
        const data = response?.data

        return Array.isArray(data) ? (data as string[]) : null
    }, [response])

    const fetchNounColorList = (params?: URLSearchParams): void => {
        fetchData(
            project === 'Nouns' ? '/noun-colors' : '/lil-noun-colors',
            params
        )
    }

    return { error, fetching, fetchNounColorList, nounColorList: list }
}

export default useNounColorList
