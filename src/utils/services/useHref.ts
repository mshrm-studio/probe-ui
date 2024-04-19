import { useMemo } from 'react'

const useHref = () => {
    const lilsLink = useMemo(() => {
        return '/lils?page=1&per_page=180&sort_method=desc&sort_property=token_id'
    }, [])

    const nounsLink = useMemo(() => {
        return '/nouns?per_page=180&sort_method=desc&sort_property=token_id'
    }, [])

    return { lilsLink, nounsLink }
}

export default useHref
