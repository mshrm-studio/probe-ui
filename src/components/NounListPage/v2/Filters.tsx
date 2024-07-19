'use client'

import React, { useState, useEffect, useContext } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import NounFiltersDto from '@/utils/dto/NounFilters'
import useFilters from '@/utils/services/useFilters'
import SelectNounColor from '@/components/Select/NounColor'
import SelectNounTrait from '@/components/Select/NounTrait'
import Project from '@/utils/dto/Project'
import styles from '@/utils/styles/nounListPageFilters.module.css'
import { XMarkIcon } from '@heroicons/react/24/solid'
import DimensionsContext from '@/utils/contexts/DimensionsContext'
import RequestingContext from '@/utils/contexts/RequestingContext'

const NounListPageFilters: React.FC<{
    project: Project
    setShowFilters: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ project, setShowFilters }) => {
    const { dimensions } = useContext(DimensionsContext)
    const { requesting } = useContext(RequestingContext)
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
            per_page: Number(searchParams.get('per_page')) || 180,
            sort_property: searchParams.get('sort_property') || 'token_id',
            sort_method: searchParams.get('sort_method') || 'desc',
        })
    }, [searchParams])

    function pushToNewQuery() {
        const params = parseFilters({ ...filters })

        const basePath = project === 'Nouns' ? '/nouns' : '/lils'

        const fullPath = params.toString()
            ? `${basePath}?${params.toString()}`
            : basePath

        router.push(fullPath)
    }

    useEffect(() => {
        pushToNewQuery()
    }, [filters])

    function updateFilters(
        e:
            | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
            | { target: { name: string; value?: string | null } }
    ) {
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
                    onClick={() => setShowFilters(false)}
                >
                    <XMarkIcon className={styles.closeButtonIcon} />
                </button>

                <div className={styles.filters}>
                    <div className={styles.filter}>
                        <SelectNounColor
                            disabled={requesting}
                            project={project}
                            selected={filters.color}
                            updateSelected={updateFilters}
                        />
                    </div>

                    <div className={styles.filter}>
                        <SelectNounTrait
                            disabled={requesting}
                            project={project}
                            layer="glasses"
                            selected={filters.glasses}
                            updateSelected={updateFilters}
                        />
                    </div>

                    <div className={styles.filter}>
                        <SelectNounTrait
                            disabled={requesting}
                            project={project}
                            layer="head"
                            selected={filters.head}
                            updateSelected={updateFilters}
                        />
                    </div>

                    <div className={styles.filter}>
                        <SelectNounTrait
                            disabled={requesting}
                            project={project}
                            layer="accessory"
                            selected={filters.accessory}
                            updateSelected={updateFilters}
                        />
                    </div>

                    <div className={styles.filter}>
                        <SelectNounTrait
                            disabled={requesting}
                            project={project}
                            layer="body"
                            selected={filters.body}
                            updateSelected={updateFilters}
                        />
                    </div>

                    <div className={styles.filter}>
                        <SelectNounTrait
                            disabled={requesting}
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
