'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Filters from '@/app/nouns/_components/Filters'
import Sorters from '@/app/nouns/_components/Sorters'
import { useCallback, useEffect, useRef, useState } from 'react'
import NounFilters from '@/utils/dto/NounFilters'
import ApiPaginationMeta from '@/utils/dto/ApiPaginationMeta'
import { debounce } from 'lodash'

type Props = {
    isLoading: boolean
    meta: ApiPaginationMeta
}

export default function Controls({ isLoading, meta }: Props) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const initializeFilters = useCallback(
        () => ({
            accessory: searchParams.get('accessory') || undefined,
            background: searchParams.get('background') || undefined,
            body: searchParams.get('body') || undefined,
            color: searchParams.get('color') || undefined,
            glasses: searchParams.get('glasses') || undefined,
            head: searchParams.get('head') || undefined,
            page: Number(searchParams.get('page')) || 1,
            per_page: Number(searchParams.get('per_page')) || 180,
            search: searchParams.get('search') || '',
            sort_property: searchParams.get('sort_property') || 'token_id',
            sort_method: searchParams.get('sort_method') || 'desc',
        }),
        [searchParams]
    )

    const [filters, setFilters] = useState<NounFilters>(initializeFilters())
    const lastScrollTop = useRef(0)

    useEffect(() => {
        setFilters(initializeFilters())
    }, [searchParams])

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())

        Object.entries(filters).forEach(([key, value]) => {
            if (value === undefined || value === '') {
                params.delete(key)
            } else {
                params.set(key, value.toString())
            }
        })

        router.replace(`?${params.toString()}`, { scroll: false })
    }, [filters, router])

    // useEffect to manage scroll, get next page when near bottom
    useEffect(() => {
        const handleScroll = debounce(() => {
            if (isLoading) return

            const tolerance = 100
            const scrollTop = document.documentElement.scrollTop
            const scrolled = window.innerHeight + scrollTop
            const totalHeight = document.documentElement.offsetHeight

            const isNearBottom = totalHeight - scrolled <= tolerance
            const isScrollingDown = scrollTop > lastScrollTop.current
            lastScrollTop.current = scrollTop // Use ref to track last scroll position

            const page = filters.page === undefined ? 1 : filters.page

            if (
                isScrollingDown &&
                isNearBottom &&
                (meta === undefined || page < meta.last_page)
            ) {
                setFilters((prev) => ({
                    ...prev,
                    page: Math.max(1, page) + 1,
                }))
            }
        }, 250)

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
            handleScroll.cancel()
        }
    }, [filters.page, isLoading, meta])

    return (
        <div className="space-y-4">
            <Sorters filters={filters} setFilters={setFilters} />

            <Filters filters={filters} setFilters={setFilters} />
        </div>
    )
}
