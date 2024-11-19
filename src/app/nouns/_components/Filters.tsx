'use client'

import React, { useState, useEffect, useContext, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import NounFiltersDto from '@/utils/dto/NounFilters'
import Project from '@/utils/dto/Project'
import styles from '@/app/nouns/_styles/filters.module.css'
import { XMarkIcon } from '@heroicons/react/24/solid'
import DimensionsContext from '@/utils/contexts/DimensionsContext'
import RequestingContext from '@/utils/contexts/RequestingContext'
import SelectNounColor from '@/components/Select/NounColor'
import SelectNounTrait from '@/components/Select/NounTrait'
import { nounTraitLayers } from '@/utils/dto/NounTraitLayer'

type Props = {
    project: Project
    setShowFilters: React.Dispatch<React.SetStateAction<boolean>>
}

const NounListPageFilters: React.FC<Props> = ({ project, setShowFilters }) => {
    const { dimensions } = useContext(DimensionsContext)
    const { requesting } = useContext(RequestingContext)
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
            search: searchParams.get('search') || '',
            per_page: Number(searchParams.get('per_page')) || 180,
            sort_property: searchParams.get('sort_property') || 'token_id',
            sort_method: searchParams.get('sort_method') || 'desc',
        }),
        [searchParams]
    )

    const [filters, setFilters] = useState<NounFiltersDto>(initializeFilters())

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())

        Object.entries(filters).forEach(([key, value]) => {
            if (value === undefined || value === '') {
                params.delete(key)
            } else {
                params.set(key, value.toString())
            }
        })

        router.push(`?${params.toString()}`)
    }, [filters, router, searchParams])

    useEffect(() => {
        if (dimensions.viewportWidth < 1280) {
            document.body.style.overflowY = 'hidden'
        }

        return () => {
            document.body.style.overflowY = 'auto'
        }
    }, [dimensions.viewportWidth])

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
                            search={
                                dimensions.viewportWidth < 768 ? false : true
                            }
                            selected={filters.color}
                            setSelected={(value) =>
                                setFilters({ ...filters, color: value })
                            }
                        />
                    </div>

                    {nounTraitLayers.map((layer) => (
                        <div key={layer} className={styles.filter}>
                            <SelectNounTrait
                                layer={layer}
                                search={
                                    dimensions.viewportWidth < 768
                                        ? false
                                        : true
                                }
                                selected={filters[layer]}
                                setSelected={(value) =>
                                    setFilters({
                                        ...filters,
                                        [layer]: value || '',
                                    })
                                }
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default NounListPageFilters
