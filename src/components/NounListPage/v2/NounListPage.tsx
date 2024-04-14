'use client'

import NounFilters from '@/components/NounListPage/v2/Filters'
import { useSearchParams } from 'next/navigation'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { debounce } from 'lodash'
import useNounList from '@/utils/services/useNounList'
import NounList from '@/components/Noun/List'
import Project from '@/utils/dto/Project'
import DimensionsContext from '@/utils/contexts/DimensionsContext'
import ShowExplorePageFiltersContext from '@/utils/contexts/ShowExplorePageFiltersContext'
import Noun from '@/utils/dto/Noun'

const NounListPage: React.FC<{ project: Project }> = ({ project }) => {
    const { dimensions } = useContext(DimensionsContext)
    const { show: showFilters } = useContext(ShowExplorePageFiltersContext)
    const [page, setPage] = useState(1)

    const minHeight = useMemo(() => {
        return dimensions.viewportHeight - dimensions.headerHeight
    }, [dimensions.viewportHeight, dimensions.headerHeight])

    const [maintainedNounList, setMaintainedNounList] = useState<Noun[]>([])

    const { error, fetching, fetchNounList, nounList, meta } =
        useNounList(project)

    useEffect(() => {
        const debouncedNounListUpdate = debounce(() => {
            if (!fetching && nounList && nounList.length > 0) {
                if (page === 1) {
                    setMaintainedNounList(nounList)
                } else {
                    setMaintainedNounList((prev) => {
                        const existingIds = new Set(
                            prev.map((item) => item.token_id)
                        )

                        const filteredNewItems = nounList.filter(
                            (item) => !existingIds.has(item.token_id)
                        )

                        return [...prev, ...filteredNewItems]
                    })
                }
            }
        }, 500)

        debouncedNounListUpdate()

        return () => debouncedNounListUpdate.cancel()
    }, [fetching, nounList])

    const searchParams = useSearchParams()

    const debouncedFetch = useCallback(
        debounce(() => {
            const params = new URLSearchParams(searchParams.toString())
            params.set('page', page.toString())
            console.log('debouncedFetch')
            fetchNounList(params)
        }, 500),
        [page, searchParams]
    ) // Dependencies to trigger updates of the debounced function

    useEffect(() => {
        console.log('Fetch useEffect triggered')
        debouncedFetch() // Call the debounced fetch function

        return () => {
            debouncedFetch.cancel() // Cleanup the debounce on unmount or when dependencies change
        }
    }, [debouncedFetch]) // Depend on the stable debouncedFetch function

    useEffect(() => {
        if (meta && page !== meta.current_page) {
            setPage(meta.current_page)
        }
    }, [meta])

    useEffect(() => {
        console.log('scroll listener useeffect')
        const handleScroll = debounce(() => {
            console.log('handleScroll')
            const tolerance = 100 // pixels from the bottom to consider as "at the bottom"
            const scrolled =
                window.innerHeight + document.documentElement.scrollTop
            const totalHeight = document.documentElement.offsetHeight

            const isNearBottom = totalHeight - scrolled <= tolerance

            if (isNearBottom && !fetching && (!meta || page < meta.last_page)) {
                console.log('setPage')
                setPage((prev) => prev + 1)
            }
        }, 100)

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
            handleScroll.cancel()
        }
    }, [fetching, meta, page])

    return (
        <div
            className="flex xl:justify-center"
            style={{ minHeight: minHeight }}
        >
            <div className="space-y-3 w-full">
                {(showFilters || dimensions.viewportWidth >= 1280) && (
                    <NounFilters
                        project={project}
                        meta={meta}
                        page={page}
                        setPage={setPage}
                    />
                )}

                {error && (
                    <p className="text-center text-red-500 font-bold">
                        {error.data.message}
                    </p>
                )}

                {maintainedNounList.length > 0 && (
                    <NounList
                        fetching={fetching}
                        nouns={maintainedNounList}
                        project={project}
                    />
                )}
            </div>
        </div>
    )
}

export default NounListPage
