import { useMemo } from 'react'
import { isNounTraitList } from '@/utils/dto/NounTrait'
import useFetcher from '@/utils/services/useFetcher'

const useHref = () => {
    const lilsLink = '/lils?per_page=40&page=1'
    const nounsLink = '/nouns?per_page=40&page=1'

    return { lilsLink, nounsLink }
}

export default useHref
