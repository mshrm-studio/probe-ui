'use client'
import LilNounFilters from '@/components/LilNoun/Filters'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { debounce } from 'lodash'
import useLilNounList from '@/utils/services/useLilNounList'
import LilNounList from '@/components/LilNoun/List'
import LilNoun from '@/utils/dto/LilNoun'
import SelectedLilNoun from '@/components/LilNoun/Selected'
import LilNounPagination from '@/components/LilNoun/Pagination'

export default function Page() {
    const { error, fetching, fetchLilNounList, lilNounList, meta } =
        useLilNounList()

    const searchParams = useSearchParams()

    useEffect(() => {
        const debouncedFetch = debounce(() => {
            fetchLilNounList(searchParams)
        }, 500)

        debouncedFetch()

        return () => debouncedFetch.cancel()
    }, [searchParams])

    const [selected, setSelected] = useState<LilNoun | null>(null)

    const updateSelected = (newSelection: LilNoun | null) => {
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
                    <LilNounFilters meta={meta} page={page} setPage={setPage} />
                </div>

                {error && <p>{error.data.message}</p>}

                {lilNounList && (
                    <div className="flex flex-col justify-center xl:flex-row-reverse">
                        {selected && (
                            <SelectedLilNoun
                                selected={selected}
                                updateSelected={updateSelected}
                            />
                        )}

                        <div className="self-auto">
                            <LilNounList
                                lilNouns={lilNounList}
                                selected={selected}
                                updateSelected={updateSelected}
                            />
                        </div>
                    </div>
                )}

                {meta && (
                    <div>
                        <LilNounPagination meta={meta} setPage={setPage} />
                    </div>
                )}
            </div>
        </div>
    )
}
