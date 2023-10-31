'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import LilNounFiltersDto from '@/utils/dto/LilNounFilters'
import useFilters from '@/utils/services/useFilters'
import SelectLilNounTrait from '@/components/SelectLilNounTrait'
import styles from '@/utils/styles/lilNounFilters.module.css'

const LilNounFilters: React.FC = () => {
    const { parseFilters } = useFilters()
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

    const updateFilters = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
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
        <div className="space-y-3">
            <div>
                <input
                    className={styles.input}
                    name="search"
                    placeholder="Search multiple traits or IDs..."
                    type="text"
                    value={filters.search}
                    onChange={updateFilters}
                />
            </div>

            <div className="flex space-x-3">
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
        </div>
    )
}

export default LilNounFilters
