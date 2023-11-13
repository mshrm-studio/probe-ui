'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import NounFiltersDto from '@/utils/dto/NounFilters'
import useFilters from '@/utils/services/useFilters'
import SelectNounTrait from '@/components/Select/NounTrait'
// import styles from '@/utils/styles/nounFilters.module.css'
import ApiMeta from '@/utils/dto/ApiMeta'
import { startCase } from 'lodash'
import Project from '@/utils/dto/Project'

interface NounFiltersProps {
    project: Project
    meta?: ApiMeta
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
}

const NounFilters: React.FC<NounFiltersProps> = ({
    project,
    meta,
    page,
    setPage,
}) => {
    const { parseFilters } = useFilters()
    const router = useRouter()
    const searchParams = useSearchParams()

    // const [searchIsFocused, setSearchIsFocused] = useState(false)

    const [filters, setFilters] = useState<NounFiltersDto>({
        accessory: searchParams?.get('accessory') ?? undefined,
        background: searchParams?.get('background') ?? undefined,
        body: searchParams?.get('body') ?? undefined,
        glasses: searchParams?.get('glasses') ?? undefined,
        head: searchParams?.get('head') ?? undefined,
        search: searchParams?.get('search') ?? '',
        per_page: Number(searchParams?.get('per_page')) || 40,
    })

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

        const basePath = project === 'Nouns' ? '/nouns' : '/lils'

        const fullPath = params.toString()
            ? `${basePath}?${params.toString()}`
            : basePath

        router.push(fullPath)
    }

    useEffect(() => {
        pushToNewQuery()
    }, [filters, page])

    return (
        <div className="space-y-3">
            {/* <div className="text-center relative">
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
            </div> */}

            <div className="flex space-x-6 items-center overflow-x-auto px-4 xl:justify-center">
                <div>
                    {meta && (
                        <p className="font-bold text-[13px] text-[#959595] whitespace-nowrap">
                            {meta.total} {startCase(project)}
                        </p>
                    )}
                </div>

                <div className="flex space-x-3">
                    <SelectNounTrait
                        project={project}
                        layer="accessory"
                        selected={filters.accessory}
                        updateSelected={updateFilters}
                    />

                    <SelectNounTrait
                        project={project}
                        layer="background"
                        selected={filters.background}
                        updateSelected={updateFilters}
                    />

                    <SelectNounTrait
                        project={project}
                        layer="body"
                        selected={filters.body}
                        updateSelected={updateFilters}
                    />

                    <SelectNounTrait
                        project={project}
                        layer="glasses"
                        selected={filters.glasses}
                        updateSelected={updateFilters}
                    />

                    <SelectNounTrait
                        project={project}
                        layer="head"
                        selected={filters.head}
                        updateSelected={updateFilters}
                    />
                </div>
            </div>
        </div>
    )
}

export default NounFilters