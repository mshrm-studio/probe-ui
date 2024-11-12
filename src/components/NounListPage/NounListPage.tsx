'use client'

import NounFilters from '@/components/NounListPage/Filters'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { debounce } from 'lodash'
import NounList from '@/components/Noun/List/List'
import Project from '@/utils/dto/Project'
import DimensionsContext from '@/utils/contexts/DimensionsContext'
import Noun, { isNounList } from '@/utils/dto/Noun'
import { useSearchParams } from 'next/navigation'
import RequestingContext from '@/utils/contexts/RequestingContext'
import Header from '@/components/NounListPage/Header'
import NounSearch from '@/components/NounListPage/Search'
import useApi from '@/utils/hooks/v2/useApi'
import ConditionalFeedback from '@/components/ConditionalFeedback'
import ApiPaginationMeta, {
    isApiPaginationMeta,
} from '@/utils/dto/ApiPaginationMeta'
import FetchingImage from '@/components/FetchingImage'

const NounListPage: React.FC<{ project: Project }> = ({ project }) => {
    const { dimensions } = useContext(DimensionsContext)
    const [page, setPage] = useState(1)
    const lastScrollTop = useRef(0)
    const [nouns, setNouns] = useState<Noun[]>([])
    const searchParams = useSearchParams()
    const { setRequesting } = useContext(RequestingContext)
    const [showFilters, setShowFilters] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const api = useApi()
    const [fetching, setFetching] = useState(false)
    const [error, setError] = useState<unknown>(null)
    const [meta, setMeta] = useState<ApiPaginationMeta>()

    // Effect to fetch nouns when the page resets
    useEffect(() => {
        async function fetchNouns() {
            setFetching(true)

            const path = project === 'LilNouns' ? '/lil-nouns' : '/nouns'

            const params = new URLSearchParams(searchParams)

            params.set('page', Math.max(1, page).toString())

            try {
                const { data, meta } = await api
                    .get(`${path}?${params}`)
                    .then((res) => res.data)

                if (isNounList(data)) {
                    setNouns((prev) => {
                        const nounMap = new Map(
                            prev.map((noun) => [noun.token_id, noun])
                        )

                        data.forEach((noun) => {
                            if (!nounMap.has(noun.token_id)) {
                                nounMap.set(noun.token_id, noun)
                            }
                        })

                        return Array.from(nounMap.values())
                    })
                }

                if (isApiPaginationMeta(meta)) {
                    setMeta(meta)
                }
            } catch (error) {
                setError(error)
            } finally {
                setFetching(false)
            }
        }

        fetchNouns()
    }, [page])

    useEffect(() => {
        setRequesting(fetching)
    }, [fetching])

    // Effect for searchParams changes
    useEffect(() => {
        setNouns([]) // Reset the nouns when searchParams change
        setPage((prev) => (prev === 1 ? 0 : 1)) // 0 or 1 to make sure re-fetch is always triggered
    }, [searchParams])

    // useEffect to manage scroll, get next page when near bottom
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
    }, [fetching, page, meta])

    const minHeight = useMemo(() => {
        return dimensions.viewportHeight - dimensions.headerHeight
    }, [dimensions.viewportHeight, dimensions.headerHeight])

    return (
        <>
            <Header
                setShowFilters={setShowFilters}
                setShowSearch={setShowSearch}
            />

            {showSearch && (
                <NounSearch project={project} setShowSearch={setShowSearch} />
            )}

            <main className="w-full px-4">
                <div
                    className="flex xl:justify-center"
                    style={{ minHeight: minHeight }}
                >
                    <div className="space-y-3 w-full">
                        {(showFilters || dimensions.viewportWidth >= 1280) && (
                            <NounFilters
                                project={project}
                                setShowFilters={setShowFilters}
                            />
                        )}

                        <ConditionalFeedback
                            error={error}
                            fetching={fetching && nouns.length === 0}
                        >
                            {nouns.length > 0 ? (
                                <>
                                    <NounList nouns={nouns} project={project} />

                                    {fetching ? (
                                        <FetchingImage />
                                    ) : (
                                        meta &&
                                        meta.current_page ===
                                            meta.last_page && (
                                            <p className="text-center font-bold">
                                                All {nouns.length}{' '}
                                                {project === 'LilNouns'
                                                    ? 'Lil Nouns'
                                                    : 'Nouns'}{' '}
                                                Loaded
                                            </p>
                                        )
                                    )}
                                </>
                            ) : (
                                <p className="text-center font-bold">
                                    No{' '}
                                    {project === 'LilNouns'
                                        ? 'Lil Nouns'
                                        : 'Nouns'}
                                </p>
                            )}
                        </ConditionalFeedback>
                    </div>
                </div>
            </main>
        </>
    )
}

export default NounListPage
