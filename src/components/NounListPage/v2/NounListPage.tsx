'use client'

import NounFilters from '@/components/NounListPage/v2/Filters'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { debounce } from 'lodash'
import NounList from '@/components/Noun/List'
import Project from '@/utils/dto/Project'
import DimensionsContext from '@/utils/contexts/DimensionsContext'
import ShowExplorePageFiltersContext from '@/utils/contexts/ShowExplorePageFiltersContext'
import Noun, { isNounList } from '@/utils/dto/Noun'
import { useSearchParams } from 'next/navigation'
import useNounList from '@/utils/services/useNounList'

const NounListPage: React.FC<{ project: Project }> = ({ project }) => {
    const { dimensions } = useContext(DimensionsContext)
    const { show: showFilters } = useContext(ShowExplorePageFiltersContext)
    const [page, setPage] = useState(1)
    const [lastScrollTop, setLastScrollTop] = useState(0)
    const [nouns, setNouns] = useState<Noun[]>([])
    const searchParams = useSearchParams()

    const { error, fetching, fetchNounList, nounList, meta } =
        useNounList(project)

    useEffect(() => {
        if (nounList) {
            if (page === 1) {
                setNouns(nounList)
            } else {
                setNouns((prev) => [...prev, ...nounList])
            }
        }
    }, [nounList])

    const loadNouns = useCallback(async () => {
        const params = new URLSearchParams(searchParams)

        params.set('page', page.toString())

        fetchNounList(params)
    }, [fetchNounList, page, searchParams]) // Dependencies include api and page

    useEffect(() => {
        loadNouns()
    }, [loadNouns])

    useEffect(() => {
        const handleScroll = debounce(() => {
            if (fetching) return

            const tolerance = 100 // pixels from the bottom to consider as "at the bottom"
            const scrollTop = document.documentElement.scrollTop // Current scroll position
            const scrolled = window.innerHeight + scrollTop
            const totalHeight = document.documentElement.offsetHeight

            // Determine if scrolling up or down
            const isScrollingDown = scrollTop > lastScrollTop
            const isNearBottom = totalHeight - scrolled <= tolerance

            if (isScrollingDown && isNearBottom) {
                setPage((prev) => prev + 1)
            }

            setLastScrollTop(scrollTop) // Update the last scroll position
        }, 250)

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)

            handleScroll.cancel()
        }
    }, [fetching, lastScrollTop])

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
                    <NounFilters project={project} setPage={setPage} />
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
                    <p className="text-center font-bold">Loading...</p>
                )}
            </div>
        </div>
    )
}

export default NounListPage
