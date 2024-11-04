'use client'

import React, { useState, useEffect, useContext, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import NounFiltersDto from '@/utils/dto/NounFilters'
import useFilters from '@/utils/services/useFilters'
import Project from '@/utils/dto/Project'
import styles from '@/utils/styles/nounListPageFilters.module.css'
import { XMarkIcon } from '@heroicons/react/24/solid'
import DimensionsContext from '@/utils/contexts/DimensionsContext'
import RequestingContext from '@/utils/contexts/RequestingContext'
import SearchSelectNounColor from '@/components/SearchSelect/NounColor'
import SearchSelectNounTrait from '@/components/SearchSelect/NounTrait'
import NounTrait from '@/utils/dto/NounTrait'

type Props = {
    accessoryList?: NounTrait[] | null
    bodyList?: NounTrait[] | null
    glassesList?: NounTrait[] | null
    headList?: NounTrait[] | null
    project: Project
    setShowFilters: React.Dispatch<React.SetStateAction<boolean>>
}

const NounListPageFilters: React.FC<Props> = ({
    accessoryList,
    bodyList,
    glassesList,
    headList,
    project,
    setShowFilters,
}) => {
    const { dimensions } = useContext(DimensionsContext)
    const { requesting } = useContext(RequestingContext)
    const { parseFilters } = useFilters()
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

    const pushToNewQuery = useCallback(() => {
        const params = parseFilters(filters)

        const basePath = project === 'Nouns' ? '/nouns' : '/lils'

        const path = params.toString()
            ? `${basePath}?${params.toString()}`
            : basePath

        router.push(path)
    }, [filters, parseFilters, project, router])

    useEffect(() => {
        if (dimensions.viewportWidth < 1280) {
            document.body.style.overflowY = 'hidden'
        }
        return () => {
            document.body.style.overflowY = 'auto'
        }
    }, [dimensions.viewportWidth])

    useEffect(() => {
        setFilters(initializeFilters())
    }, [searchParams, initializeFilters])

    useEffect(() => {
        pushToNewQuery()
    }, [filters, pushToNewQuery])

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
                        <SearchSelectNounColor
                            disabled={requesting}
                            project={project}
                            selected={filters.color}
                            setSelected={(value) =>
                                setFilters({ ...filters, color: value })
                            }
                        />
                    </div>

                    {glassesList && (
                        <SearchSelectNounTrait
                            disabled={requesting}
                            project={project}
                            layer="glasses"
                            options={glassesList}
                            selected={filters.glasses}
                            setSelected={(value) =>
                                setFilters({ ...filters, glasses: value })
                            }
                        />
                    )}

                    {headList && (
                        <SearchSelectNounTrait
                            disabled={requesting}
                            project={project}
                            layer="head"
                            options={headList}
                            selected={filters.head}
                            setSelected={(value) =>
                                setFilters({ ...filters, head: value })
                            }
                        />
                    )}

                    {accessoryList && (
                        <SearchSelectNounTrait
                            disabled={requesting}
                            project={project}
                            layer="accessory"
                            options={accessoryList}
                            selected={filters.accessory}
                            setSelected={(value) =>
                                setFilters({ ...filters, accessory: value })
                            }
                        />
                    )}

                    {bodyList && (
                        <SearchSelectNounTrait
                            disabled={requesting}
                            project={project}
                            layer="body"
                            options={bodyList}
                            selected={filters.body}
                            setSelected={(value) =>
                                setFilters({ ...filters, body: value })
                            }
                        />
                    )}

                    <SearchSelectNounTrait
                        disabled={requesting}
                        project={project}
                        layer="background"
                        selected={filters.background}
                        setSelected={(value) =>
                            setFilters({ ...filters, background: value })
                        }
                    />
                </div>
            </div>
        </div>
    )
}

export default NounListPageFilters
