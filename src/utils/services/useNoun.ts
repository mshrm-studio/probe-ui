import { useCallback, useMemo } from 'react'
import { isNoun } from '@/utils/dto/Noun'
import useFetcher from '@/utils/services/useFetcher'
import Project from '@/utils/dto/Project'

const useNoun = (project: Project) => {
    const { error, fetchData, fetching, response } = useFetcher()

    const noun = useMemo(() => {
        const data = response?.data?.data

        return isNoun(data) ? data : null
    }, [response])

    const fetchNoun = useCallback(
        (nounId: number): void => {
            fetchData(
                project === 'Nouns'
                    ? `/nouns/${nounId}`
                    : `/lil-nouns/${nounId}`
            )
        },
        [fetchData]
    )

    return { error, fetching, fetchNoun, noun }
}

export default useNoun
