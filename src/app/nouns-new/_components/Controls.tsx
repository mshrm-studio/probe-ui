'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Filters from '@/app/nouns-new/_components/Filters'
import Sorters from '@/app/nouns-new/_components/Sorters'
import { useCallback, useEffect, useState } from 'react'
import NounFilters from '@/utils/dto/NounFilters'

export default function Controls() {
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
            per_page: Number(searchParams.get('per_page')) || 180,
            search: searchParams.get('search') || '',
            sort_property: searchParams.get('sort_property') || 'token_id',
            sort_method: searchParams.get('sort_method') || 'desc',
        }),
        [searchParams]
    )

    const [filters, setFilters] = useState<NounFilters>(initializeFilters())

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

        router.replace(`?${params.toString()}`)
    }, [filters, router])

    return (
        <div className="space-y-4">
            <Sorters filters={filters} setFilters={setFilters} />

            <Filters filters={filters} setFilters={setFilters} />
        </div>
    )
}
