const useHref = () => {
    const lilsLink =
        '/lils?page=1&per_page=180&sort_method=desc&sort_property=token_id'
    const nounsLink =
        '/nouns?page=1&per_page=180&sort_method=desc&sort_property=token_id'

    return { lilsLink, nounsLink }
}

export default useHref
