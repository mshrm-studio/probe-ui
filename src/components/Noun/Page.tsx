'use client'
import NounFilters from '@/components/Noun/Filters'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { debounce } from 'lodash'
import useNounList from '@/utils/services/useNounList'
import NounList from '@/components/Noun/List'
import Noun from '@/utils/dto/Noun'
import SelectedNoun from '@/components/Noun/Selected'
import NounPagination from '@/components/Noun/Pagination'
import Project from '@/utils/dto/Project'

const NounPage: React.FC<{ project: Project }> = ({ project }) => {
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
                    <div className="flex justify-center">
                        <div className="border-t pt-3 border-[#E0E0E0] flex flex-col justify-center xl:flex-row-reverse">
                            {selected && (
                                <SelectedNoun
                                    project={project}
                                    selected={selected}
                                    updateSelected={updateSelected}
                                />
                            )}

                            <div className="self-auto">
                                <NounList
                                    fetching={fetching}
                                    nouns={nounList}
                                    selected={selected}
                                    updateSelected={updateSelected}
                                />
                            </div>
                        </div>
                    </div>
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

export default NounPage
