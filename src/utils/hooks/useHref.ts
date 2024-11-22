const useHref = () => {
    const dreamsLink =
        '/nouns/dreams?page=1&per_page=180&sort_property=id&sort_method=desc'

    const lilsLink =
        '/lils?page=1&per_page=180&sort_property=token_id&sort_method=desc'

    const nounsLink =
        '/nouns?page=1&per_page=180&sort_property=token_id&sort_method=desc'

    return { dreamsLink, lilsLink, nounsLink }
}

export default useHref
