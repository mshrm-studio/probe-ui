'use client'

import NounFilters from '@/components/NounListPage/Filters'
import { useSearchParams } from 'next/navigation'
import { useContext, useEffect, useMemo, useState } from 'react'
import { debounce } from 'lodash'
import useNounList from '@/utils/services/useNounList'
import NounList from '@/components/Noun/List/List'
import NounPagination from '@/components/NounListPage/Pagination'
import Project from '@/utils/dto/Project'
import DimensionsContext from '@/utils/contexts/DimensionsContext'
import ShowExplorePageFiltersContext from '@/utils/contexts/ShowExplorePageFiltersContext'

const NounListPage: React.FC<{ project: Project }> = ({ project }) => {
    const { dimensions } = useContext(DimensionsContext)
    const { show: showFilters } = useContext(ShowExplorePageFiltersContext)

    const minHeight = useMemo(() => {
        return dimensions.viewportHeight - dimensions.headerHeight
    }, [dimensions.viewportHeight, dimensions.headerHeight])

    const { error, fetching, fetchNounList, nounList, meta } =
        useNounList(project)

    const searchParams = useSearchParams()

    useEffect(() => {
        const debouncedFetch = debounce(() => {
            fetchNounList(searchParams)
        }, 500)

        debouncedFetch()

        return () => debouncedFetch.cancel()
    }, [searchParams])

    const [page, setPage] = useState(Number(searchParams?.get('page')) || 1)

    useEffect(() => {
        if (meta && page !== meta.current_page) {
            setPage(meta.current_page)
        }
    }, [meta])

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

                {nounList && (
                    <NounList
                        fetching={fetching}
                        nouns={nounList}
                        project={project}
                    />
                )}

                {meta && (
                    <div>
                        <NounPagination meta={meta} setPage={setPage} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default NounListPage
