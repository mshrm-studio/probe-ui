'use client'

import React, { useState, useEffect, useContext } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import NounFiltersDto from '@/utils/dto/NounFilters'
import useFilters from '@/utils/services/useFilters'
import Project from '@/utils/dto/Project'
import styles from '@/utils/styles/nounListPageFilters.module.css'
import { XMarkIcon } from '@heroicons/react/24/solid'
import DimensionsContext from '@/utils/contexts/DimensionsContext'
import RequestingContext from '@/utils/contexts/RequestingContext'
import NounTrait from '@/utils/dto/NounTrait'
import SearchSelectNounColor from '@/components/SearchSelect/NounColor'
import SearchSelectNounTrait from '@/components/SearchSelect/NounTrait'

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

    type FilterValue = string | number | null | undefined

    const [accessory, setAccessory] = useState<FilterValue>(
        searchParams.get('accessory')
    )
    const [background, setBackground] = useState<FilterValue>(
        searchParams.get('background')
    )
    const [body, setBody] = useState<FilterValue>(searchParams.get('body'))
    const [color, setColor] = useState<FilterValue>(searchParams.get('color'))
    const [glasses, setGlasses] = useState<FilterValue>(
        searchParams.get('glasses')
    )
    const [head, setHead] = useState<FilterValue>(searchParams.get('head'))

    useEffect(() => {
        const newAccessory =
            typeof accessory === 'string' ? accessory : undefined
        const newBackground =
            typeof background === 'string' ? background : undefined
        const newBody = typeof body === 'string' ? body : undefined
        const newColor = typeof color === 'string' ? color : undefined
        const newGlasses = typeof glasses === 'string' ? glasses : undefined
        const newHead = typeof head === 'string' ? head : undefined

        setFilters((values) => ({
            ...values,
            accessory: newAccessory,
            background: newBackground,
            body: newBody,
            color: newColor,
            glasses: newGlasses,
            head: newHead,
        }))
    }, [accessory, background, body, color, glasses, head])

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
                    {/* <div className={styles.filter}>
                        <SelectNounColor
                            disabled={requesting}
                            project={project}
                            selected={filters.color}
                            updateSelected={updateFilters}
                        />
                    </div> */}

                    <div className={styles.filter}>
                        <SearchSelectNounColor
                            disabled={requesting}
                            project={project}
                            selected={filters.color}
                            setSelected={setColor}
                        />
                    </div>

                    {/* {glassesList && (
                        <div className={styles.filter}>
                            <SelectNounTrait
                                disabled={requesting}
                                project={project}
                                layer="glasses"
                                options={glassesList}
                                selected={filters.glasses}
                                updateSelected={updateFilters}
                            />
                        </div>
                    )} */}

                    {glassesList && (
                        <div className={styles.filter}>
                            <SearchSelectNounTrait
                                disabled={requesting}
                                project={project}
                                layer="glasses"
                                options={glassesList}
                                selected={filters.glasses}
                                setSelected={setGlasses}
                            />
                        </div>
                    )}

                    {/* {headList && (
                        <div className={styles.filter}>
                            <SelectNounTrait
                                disabled={requesting}
                                project={project}
                                layer="head"
                                options={headList}
                                selected={filters.head}
                                updateSelected={updateFilters}
                            />
                        </div>
                    )} */}

                    {headList && (
                        <div className={styles.filter}>
                            <SearchSelectNounTrait
                                disabled={requesting}
                                project={project}
                                layer="head"
                                options={headList}
                                selected={filters.head}
                                setSelected={setHead}
                            />
                        </div>
                    )}

                    {/* {accessoryList && (
                        <div className={styles.filter}>
                            <SelectNounTrait
                                disabled={requesting}
                                project={project}
                                layer="accessory"
                                options={accessoryList}
                                selected={filters.accessory}
                                updateSelected={updateFilters}
                            />
                        </div>
                    )} */}

                    {accessoryList && (
                        <div className={styles.filter}>
                            <SearchSelectNounTrait
                                disabled={requesting}
                                project={project}
                                layer="accessory"
                                options={accessoryList}
                                selected={filters.accessory}
                                setSelected={setAccessory}
                            />
                        </div>
                    )}

                    {/* {bodyList && (
                        <div className={styles.filter}>
                            <SelectNounTrait
                                disabled={requesting}
                                project={project}
                                layer="body"
                                options={bodyList}
                                selected={filters.body}
                                updateSelected={updateFilters}
                            />
                        </div>
                    )} */}

                    {bodyList && (
                        <div className={styles.filter}>
                            <SearchSelectNounTrait
                                disabled={requesting}
                                project={project}
                                layer="body"
                                options={bodyList}
                                selected={filters.body}
                                setSelected={setBody}
                            />
                        </div>
                    )}

                    {/* <div className={styles.filter}>
                        <SelectNounTrait
                            disabled={requesting}
                            project={project}
                            layer="background"
                            selected={filters.background}
                            updateSelected={updateFilters}
                        />
                    </div> */}

                    <div className={styles.filter}>
                        <SearchSelectNounTrait
                            disabled={requesting}
                            project={project}
                            layer="background"
                            selected={filters.background}
                            setSelected={setBackground}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NounListPageFilters
