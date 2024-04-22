'use client'

import React, { useState, useEffect, useContext } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import NounFiltersDto from '@/utils/dto/NounFilters'
import useFilters from '@/utils/services/useFilters'
import SelectNounColor from '@/components/Select/NounColor'
import SelectNounTrait from '@/components/Select/NounTrait'
import ApiMeta from '@/utils/dto/ApiMeta'
import Project from '@/utils/dto/Project'
import styles from '@/utils/styles/nounListPageFilters.module.css'
import { XMarkIcon } from '@heroicons/react/24/solid'
import ShowExplorePageFiltersContext from '@/utils/contexts/ShowExplorePageFiltersContext'
import DimensionsContext from '@/utils/contexts/DimensionsContext'

const NounListPageFilters: React.FC<{
    project: Project
    meta?: ApiMeta
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
}> = ({ project, meta, page, setPage }) => {
    const { dimensions } = useContext(DimensionsContext)
    const { setShow } = useContext(ShowExplorePageFiltersContext)
    const { parseFilters } = useFilters()
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        if (dimensions.viewportWidth < 1280) {
            document.body.style.overflowY = 'hidden'
        }

        return () => {
            document.body.style.overflowY = 'auto'
        }
    }, [dimensions.viewportWidth])

    const [filters, setFilters] = useState<NounFiltersDto>({
        accessory: searchParams?.get('accessory') ?? undefined,
        background: searchParams?.get('background') ?? undefined,
        body: searchParams?.get('body') ?? undefined,
        color: searchParams?.get('color') ?? undefined,
        glasses: searchParams?.get('glasses') ?? undefined,
        head: searchParams?.get('head') ?? undefined,
        search: searchParams?.get('search') ?? '',
        page: Number(searchParams?.get('page')) || 1,
        per_page: Number(searchParams?.get('per_page')) || 180,
        sort_property: searchParams?.get('sort_property') || 'token_id',
        sort_method: searchParams?.get('sort_method') || 'desc',
    })

    useEffect(() => {
        setFilters({
            accessory: searchParams.get('accessory') ?? undefined,
            background: searchParams.get('background') ?? undefined,
            body: searchParams.get('body') ?? undefined,
            color: searchParams.get('color') ?? undefined,
            glasses: searchParams.get('glasses') ?? undefined,
            head: searchParams.get('head') ?? undefined,
            search: searchParams.get('search') ?? '',
            page: Number(searchParams.get('page')) || 1,
            per_page: Number(searchParams.get('per_page')) || 180,
            sort_property: searchParams.get('sort_property') || 'token_id',
            sort_method: searchParams.get('sort_method') || 'desc',
        })
    }, [searchParams])

    function pushToNewQuery() {
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

    function updateFilters(
        e:
            | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
            | { target: { name: string; value?: string | null } }
    ) {
        setPage(1)

        setFilters((values) => ({
            ...values,
            [e.target.name]: e.target.value || undefined,
        }))
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <button
                    type="button"
                    className={styles.closeButton}
                    onClick={() => setShow(false)}
                >
                    <XMarkIcon className="h-7 w-7 text-[#4a4545]" />
                </button>

                <div className={styles.filters}>
                    <div className={styles.filter}>
                        <SelectNounColor
                            project={project}
                            selected={filters.color}
                            updateSelected={updateFilters}
                        />
                    </div>

                    <div className={styles.filter}>
                        <SelectNounTrait
                            project={project}
                            layer="glasses"
                            selected={filters.glasses}
                            updateSelected={updateFilters}
                        />
                    </div>

                    <div className={styles.filter}>
                        <SelectNounTrait
                            project={project}
                            layer="head"
                            selected={filters.head}
                            updateSelected={updateFilters}
                        />
                    </div>

                    <div className={styles.filter}>
                        <SelectNounTrait
                            project={project}
                            layer="accessory"
                            selected={filters.accessory}
                            updateSelected={updateFilters}
                        />
                    </div>

                    <div className={styles.filter}>
                        <SelectNounTrait
                            project={project}
                            layer="body"
                            selected={filters.body}
                            updateSelected={updateFilters}
                        />
                    </div>

                    <div className={styles.filter}>
                        <SelectNounTrait
                            project={project}
                            layer="background"
                            selected={filters.background}
                            updateSelected={updateFilters}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NounListPageFilters
