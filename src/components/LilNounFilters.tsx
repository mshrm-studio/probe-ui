'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import LilNounFiltersDto from '@/utils/dto/LilNounFilters'
import useFilters from '@/utils/services/useFilters'
import SelectLilNounTrait from '@/components/SelectLilNounTrait'
import styles from '@/utils/styles/lilNounFilters.module.css'
import ApiMeta from '@/utils/dto/ApiMeta'
import LilNounPagination from './LilNounPagination'

interface LilNounFiltersProps {
    meta?: ApiMeta
}

const LilNounFilters: React.FC<LilNounFiltersProps> = ({ meta }) => {
    const { parseFilters } = useFilters()
    const router = useRouter()
    const searchParams = useSearchParams()

    const [searchIsFocused, setSearchIsFocused] = useState(false)

    const [page, setPage] = useState(Number(searchParams.get('page')) || 1)

    const [filters, setFilters] = useState<LilNounFiltersDto>({
        accessory: searchParams.get('accessory') ?? undefined,
        background: searchParams.get('background') ?? undefined,
        body: searchParams.get('body') ?? undefined,
        glasses: searchParams.get('glasses') ?? undefined,
        head: searchParams.get('head') ?? undefined,
        search: searchParams.get('search') ?? '',
        per_page: Number(searchParams.get('per_page')) || 40,
    })

    const changePage = (page: number) => {
        setPage(page)
    }

    const updateFilters = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setPage(1)

        setFilters((values) => ({
            ...values,
            [e.target.name]: e.target.value,
        }))
    }

    const pushToNewQuery = () => {
        const params = parseFilters({ ...filters, page: page })

        router.push(`/?${params.toString()}`)
    }

    useEffect(() => {
        pushToNewQuery()
    }, [filters, page])

    return (
        <div className="space-y-3">
            <div className="text-center relative">
                {!searchIsFocused && filters.search && (
                    <label htmlFor="search" className={styles.inputLabel}>
                        Search:
                    </label>
                )}

                <input
                    id="search"
                    className={styles.input}
                    name="search"
                    placeholder="Search multiple traits..."
                    type="text"
                    value={filters.search}
                    onChange={updateFilters}
                    onFocus={() => setSearchIsFocused(true)}
                    onBlur={() => setSearchIsFocused(false)}
                />
            </div>

            <div className="flex space-x-6 items-center overflow-x-auto px-4 xl:justify-center">
                <div>
                    {meta && (
                        <p className="font-bold text-[13px] text-[#959595] whitespace-nowrap">
                            {meta.total} Lil Nouns
                        </p>
                    )}
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

            {meta && (
                <div>
                    <LilNounPagination meta={meta} changePage={changePage} />
                </div>
            )}
        </div>
    )
}

export default LilNounFilters
