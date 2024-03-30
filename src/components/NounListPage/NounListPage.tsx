'use client'
import NounFilters from '@/components/NounListPage/Filters'
import { useSearchParams } from 'next/navigation'
import { useContext, useEffect, useMemo, useState } from 'react'
import { debounce } from 'lodash'
import useNounList from '@/utils/services/useNounList'
import NounList from '@/components/Noun/List'
import Noun from '@/utils/dto/Noun'
import NounPagination from '@/components/NounListPage/Pagination'
import Project from '@/utils/dto/Project'
import NounSwitch from '@/components/NounListPage/Switch'
import DimensionsContext from '@/utils/contexts/DimensionsContext'

const NounListPage: React.FC<{ project: Project }> = ({ project }) => {
    const { dimensions } = useContext(DimensionsContext)

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

    const [selected, setSelected] = useState<Noun | null>(null)

    const updateSelected = (newSelection: Noun | null) => {
        setSelected(
            selected?.token_id == newSelection?.token_id ? null : newSelection
        )
    }

    const [page, setPage] = useState(Number(searchParams?.get('page')) || 1)

    useEffect(() => {
        if (meta && page !== meta.current_page) {
            setPage(meta.current_page)
        }
    }, [meta])

    return (
        <div className="space-y-6" style={{ minHeight: minHeight }}>
            <div>
                <NounSwitch />
            </div>

            <div className="flex xl:justify-center">
                <div className="space-y-3 w-full">
                    <div className="-mx-4">
                        <NounFilters
                            project={project}
                            meta={meta}
                            page={page}
                            setPage={setPage}
                        />
                    </div>

                    {error && <p>{error.data.message}</p>}

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
        </div>
    )
}

export default NounListPage
