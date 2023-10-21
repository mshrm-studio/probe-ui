'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import LilNounFiltersDto from '@/utils/dto/LilNounFilters'
import useApiService from '@/utils/hooks/useApiService'
import SelectLilNounTrait from '@/components/SelectLilNounTrait'

const LilNounFilters: React.FC = () => {
    const { parseFilters } = useApiService()
    const router = useRouter()
    const searchParams = useSearchParams()

    const [filters, setFilters] = useState<LilNounFiltersDto>({
        accessory: searchParams.get('accessory') ?? undefined,
        background: searchParams.get('background') ?? undefined,
        body: searchParams.get('body') ?? undefined,
        glasses: searchParams.get('glasses') ?? undefined,
        head: searchParams.get('head') ?? undefined,
        search: searchParams.get('search') ?? '',
    })

    const updateFilters = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters((values) => ({
            ...values,
            [e.target.name]: e.target.value,
        }))
    }

    useEffect(() => {
        const params = parseFilters(filters)

        router.push(`/?${params.toString()}`)
    }, [filters])

    return (
        <div>
            <SelectLilNounTrait
                layer="accessory"
                selected={filters.accessory}
                updateSelected={updateFilters}
            />

            <SelectLilNounTrait
                layer="background"
                selected={filters.background}
                updateSelected={updateFilters}
            />

            <SelectLilNounTrait
                layer="body"
                selected={filters.body}
                updateSelected={updateFilters}
            />

            <SelectLilNounTrait
                layer="glasses"
                selected={filters.glasses}
                updateSelected={updateFilters}
            />

            <SelectLilNounTrait
                layer="head"
                selected={filters.head}
                updateSelected={updateFilters}
            />
        </div>
    )
}

export default LilNounFilters
