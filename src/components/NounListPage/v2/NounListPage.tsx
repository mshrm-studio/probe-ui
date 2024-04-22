'use client'

import NounFilters from '@/components/NounListPage/v2/Filters'
import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import { debounce } from 'lodash'
import NounList from '@/components/Noun/List'
import Project from '@/utils/dto/Project'
import DimensionsContext from '@/utils/contexts/DimensionsContext'
import ShowExplorePageFiltersContext from '@/utils/contexts/ShowExplorePageFiltersContext'
import Noun from '@/utils/dto/Noun'
import { useSearchParams } from 'next/navigation'
import useNounList from '@/utils/services/useNounList'
import RequestingContext from '@/utils/contexts/RequestingContext'
import SpacesImage from '@/components/SpacesImage'

const NounListPage: React.FC<{ project: Project }> = ({ project }) => {
    const { dimensions } = useContext(DimensionsContext)
    const { show: showFilters } = useContext(ShowExplorePageFiltersContext)
    const [page, setPage] = useState(1)
    const lastScrollTop = useRef(0)
    const [nouns, setNouns] = useState<Noun[]>([])
    const searchParams = useSearchParams()
    const { setRequesting } = useContext(RequestingContext)

    const { error, fetching, fetchNounList, nounList, meta } =
        useNounList(project)

    // Function to handle fetching based on parameters
    const fetchNouns = useCallback(
        (pageNumber: number) => {
            const params = new URLSearchParams(searchParams)

            params.set('page', Math.max(1, pageNumber).toString())

            console.log('fetchNouns useCallback, params:', params.toString())

            fetchNounList(params)
        },
        [fetchNounList, searchParams]
    )

    useEffect(() => {
        setRequesting(fetching)
    }, [fetching])

    // Effect for searchParams changes
    useEffect(() => {
        console.log('searchParams useEffect, params:', searchParams.toString())
        setNouns([]) // Reset the nouns when searchParams change
        setPage((prev) => (prev === 1 ? 0 : 1)) // 0 or 1 to make sure re-fetch is always triggered
    }, [searchParams])

    // Effect to fetch nouns when the page resets
    useEffect(() => {
        console.log('page useEffect, page:', page)
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

    const minHeight = useMemo(() => {
        return dimensions.viewportHeight - dimensions.headerHeight
    }, [dimensions.viewportHeight, dimensions.headerHeight])

    return (
        <div
            className="flex xl:justify-center"
            style={{ minHeight: minHeight }}
        >
            <div className="space-y-3 w-full">
                {(showFilters || dimensions.viewportWidth >= 1280) && (
                    <NounFilters project={project} />
                )}

                {error && (
                    <p className="text-center text-red-500 font-bold">
                        {error.data.message}
                    </p>
                )}

                {nouns.length > 0 && (
                    <NounList
                        fetching={fetching}
                        nouns={nouns}
                        project={project}
                    />
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

                {!fetching && meta && meta.current_page === meta.last_page && (
                    <p className="text-center font-bold">
                        All {nouns.length}{' '}
                        {project === 'LilNouns' ? 'Lil Nouns' : 'Nouns'} loaded
                    </p>
                )}
            </div>
        </div>
    )
}

export default NounListPage
