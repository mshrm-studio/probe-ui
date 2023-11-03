import { useMemo } from 'react'
import { isLilNounTraitList } from '@/utils/dto/LilNounTrait'
import useFetcher from '@/utils/services/useFetcher'

const useHref = () => {
    const lilsLink = '/lils?per_page=40&page=1'
    const nounsLink = '/nouns'

    return { lilsLink, nounsLink }
}

export default useHref
