import { useMemo } from 'react'
import { isNounTraitList } from '@/utils/dto/NounTrait'
import useFetcher from '@/utils/services/useFetcher'
import Project from '@/utils/dto/Project'

const useNounList = (project: Project) => {
    const { error, fetchData, fetching, response } = useFetcher()

    const list = useMemo(() => {
        const data = response?.data?.data

        return isNounTraitList(data) ? data : null
    }, [response])

    const fetchNounTraitList = (params?: URLSearchParams): void => {
        fetchData(
            project === 'Nouns' ? '/noun-traits' : '/lil-noun-traits',
            params
        )
    }

    return { error, fetching, fetchNounTraitList, nounTraitList: list }
}

export default useNounList
