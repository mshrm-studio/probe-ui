'use client'

import NounFilters from '@/components/NounListPage/Filters'
import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import { debounce } from 'lodash'
import NounList from '@/components/Noun/List/List'
import Project from '@/utils/dto/Project'
import DimensionsContext from '@/utils/contexts/DimensionsContext'
import Noun from '@/utils/dto/Noun'
import { useSearchParams } from 'next/navigation'
import useNounList from '@/utils/services/useNounList'
import RequestingContext from '@/utils/contexts/RequestingContext'
import SpacesImage from '@/components/SpacesImage'
import Header from '@/components/NounListPage/Header'
import NounSearch from '@/components/NounListPage/Search'
import useNounTraitList from '@/utils/services/useNounTraitList'

const NounListPage: React.FC<{ project: Project }> = ({ project }) => {
    const { dimensions } = useContext(DimensionsContext)
    const [page, setPage] = useState(1)
    const lastScrollTop = useRef(0)
    const [nouns, setNouns] = useState<Noun[]>([])
    const searchParams = useSearchParams()
    const { setRequesting } = useContext(RequestingContext)
    const [showFilters, setShowFilters] = useState(false)
    const [showSearch, setShowSearch] = useState(false)

    const { error, fetching, fetchNounList, nounList, meta } =
        useNounList(project)

    // Function to handle fetching based on parameters
    const fetchNouns = useCallback(
        (pageNumber: number) => {
            const params = new URLSearchParams(searchParams)

            params.set('page', Math.max(1, pageNumber).toString())

            fetchNounList(params)
        },
        [fetchNounList, searchParams]
    )

    useEffect(() => {
        setRequesting(fetching)
    }, [fetching])

    // Effect for searchParams changes
    useEffect(() => {
        setNouns([]) // Reset the nouns when searchParams change
        setPage((prev) => (prev === 1 ? 0 : 1)) // 0 or 1 to make sure re-fetch is always triggered
    }, [searchParams])

    // Effect to fetch nouns when the page resets
    useEffect(() => {
        fetchNouns(page)
    }, [page])

    // useEffect to manage nounList updates
    useEffect(() => {
        if (nounList) {
            setNouns((prev) => {
                const nounMap = new Map(
                    prev.map((noun) => [noun.token_id, noun])
                )

                nounList.forEach((noun) => {
                    if (!nounMap.has(noun.token_id)) {
                        nounMap.set(noun.token_id, noun)
                    }
                })

                return Array.from(nounMap.values())
            })
        }
    }, [nounList])

    useEffect(() => {
        const handleScroll = debounce(() => {
            if (fetching) return

            const tolerance = 100
            const scrollTop = document.documentElement.scrollTop
            const scrolled = window.innerHeight + scrollTop
            const totalHeight = document.documentElement.offsetHeight

            const isNearBottom = totalHeight - scrolled <= tolerance
            const isScrollingDown = scrollTop > lastScrollTop.current
            lastScrollTop.current = scrollTop // Use ref to track last scroll position

            if (
                isScrollingDown &&
                isNearBottom &&
                (meta === undefined || page < meta.last_page)
            ) {
                setPage((prev) => Math.max(1, prev) + 1)
            }
        }, 250)

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
            handleScroll.cancel()
        }
    }, [fetching, page, meta]) // Only re-run if fetching, page, or meta changes

    const {
        fetchNounTraitList: fetchAccessoryList,
        nounTraitList: accessoryList,
    } = useNounTraitList(project)

    const { fetchNounTraitList: fetchBodyList, nounTraitList: bodyList } =
        useNounTraitList(project)

    const { fetchNounTraitList: fetchGlassesList, nounTraitList: glassesList } =
        useNounTraitList(project)

    const { fetchNounTraitList: fetchHeadList, nounTraitList: headList } =
        useNounTraitList(project)

    useEffect(() => {
        const accessoryListParams = new URLSearchParams()
        accessoryListParams.set('per_page', '300')
        accessoryListParams.set('layer', 'accessory')
        fetchAccessoryList(accessoryListParams)

        const bodyListParams = new URLSearchParams()
        bodyListParams.set('per_page', '300')
        bodyListParams.set('layer', 'body')
        fetchBodyList(bodyListParams)

        const glassesListParams = new URLSearchParams()
        glassesListParams.set('per_page', '300')
        glassesListParams.set('layer', 'glasses')
        fetchGlassesList(glassesListParams)

        const headListParams = new URLSearchParams()
        headListParams.set('per_page', '300')
        headListParams.set('layer', 'head')
        fetchHeadList(headListParams)
    }, [])

    const minHeight = useMemo(() => {
        return dimensions.viewportHeight - dimensions.headerHeight
    }, [dimensions.viewportHeight, dimensions.headerHeight])

    return (
        <>
            <Header
                setShowFilters={setShowFilters}
                setShowSearch={setShowSearch}
            />

            {accessoryList &&
                bodyList &&
                glassesList &&
                headList &&
                showSearch && (
                    <NounSearch
                        accessoryList={accessoryList}
                        bodyList={bodyList}
                        glassesList={glassesList}
                        headList={headList}
                        project={project}
                        setShowSearch={setShowSearch}
                    />
                )}

            <main className="w-full px-4">
                <div
                    className="flex xl:justify-center"
                    style={{ minHeight: minHeight }}
                >
                    <div className="space-y-3 w-full">
                        {(showFilters || dimensions.viewportWidth >= 1280) && (
                            <NounFilters
                                accessoryList={accessoryList}
                                bodyList={bodyList}
                                glassesList={glassesList}
                                headList={headList}
                                project={project}
                                setShowFilters={setShowFilters}
                            />
                        )}

                        {error && (
                            <p className="text-center text-red-500 font-bold">
                                {error.data.message}
                            </p>
                        )}

                        {nouns.length > 0 && (
                            <NounList nouns={nouns} project={project} />
                        )}

                        {fetching && (
                            <div className="pt-32">
                                <SpacesImage
                                    className="mx-auto h-10 w-10"
                                    src="misc/probe-loader.gif"
                                    alt="Loader"
                                />
                            </div>
                        )}

                        {!fetching &&
                            meta &&
                            meta.current_page === meta.last_page && (
                                <p className="text-center font-bold">
                                    All {nouns.length}{' '}
                                    {project === 'LilNouns'
                                        ? 'Lil Nouns'
                                        : 'Nouns'}{' '}
                                    loaded
                                </p>
                            )}
                    </div>
                </div>
            </main>
        </>
    )
}

export default NounListPage
