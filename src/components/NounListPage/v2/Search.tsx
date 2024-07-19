'use client'

import React, { useState, useEffect, useContext, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Project from '@/utils/dto/Project'
import styles from '@/utils/styles/nounListPageSearch.module.css'
import { XMarkIcon } from '@heroicons/react/24/solid'
import DimensionsContext from '@/utils/contexts/DimensionsContext'
import RequestingContext from '@/utils/contexts/RequestingContext'
import SearchSelect from '@/components/SearchSelect'
import useNounTraitList from '@/utils/services/useNounTraitList'
import { startCase } from 'lodash'

const NounListPageSearch: React.FC<{
    project: Project
    setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ project, setShowSearch }) => {
    const { dimensions } = useContext(DimensionsContext)
    const { requesting } = useContext(RequestingContext)
    const router = useRouter()
    const searchParams = useSearchParams()
    const [search, setSearch] = useState<string>()

    function updateSelected(value?: string | number) {
        if (typeof value === 'string') {
            setSearch(value)
        }
    }

    const {
        fetchNounTraitList: fetchAccessoryList,
        nounTraitList: accessoryList,
    } = useNounTraitList(project)

    const { fetchNounTraitList: fetchBodyList, nounTraitList: bodyList } =
        useNounTraitList(project)

    const { fetchNounTraitList: fetchGlassesList, nounTraitList: glassesList } =
        useNounTraitList(project)

    const { fetchNounTraitList: fetchHeadList, nounTraitList: headList } =
        useNounTraitList(project)

    useEffect(() => {
        const accessoryListParams = new URLSearchParams()
        accessoryListParams.set('per_page', '300')
        accessoryListParams.set('layer', 'accessory')
        fetchAccessoryList(accessoryListParams)

        const bodyListParams = new URLSearchParams()
        bodyListParams.set('per_page', '300')
        bodyListParams.set('layer', 'body')
        fetchBodyList(bodyListParams)

        const glassesListParams = new URLSearchParams()
        glassesListParams.set('per_page', '300')
        glassesListParams.set('layer', 'glasses')
        fetchGlassesList(glassesListParams)

        const headListParams = new URLSearchParams()
        headListParams.set('per_page', '300')
        headListParams.set('layer', 'head')
        fetchHeadList(headListParams)
    }, [])

    const options = useMemo(() => {
        const listOfAllLayers = [
            ...(accessoryList || []),
            ...(bodyList || []),
            ...(glassesList || []),
            ...(headList || []),
        ]

        return listOfAllLayers
            .map((item) => ({
                imgSrc: item.svg_url,
                label: `${startCase(
                    item.name.replace(new RegExp(`^${item.layer}-`), '')
                )} (${startCase(item.layer)})`,
                value: item.name,
            }))
            .reduce(
                (unique, item) => {
                    return unique.some((uItem) => uItem.value === item.value)
                        ? unique
                        : [...unique, item]
                },
                [] as { imgSrc: string; label: string; value: string }[]
            )
            .sort((a, b) => a.label.localeCompare(b.label))
    }, [accessoryList, bodyList, glassesList, headList])

    // useEffect(() => {
    //     setSearch(searchParams.get('search') ?? '')
    // }, [searchParams])

    // function pushToNewQuery() {
    //     const basePath = project === 'Nouns' ? '/nouns' : '/lils'

    //     const fullPath = search ? `${basePath}?${search}` : basePath

    //     router.push(fullPath)
    // }

    // useEffect(() => {
    //     pushToNewQuery()
    // }, [search])

    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <button
                    type="button"
                    className={styles.closeButton}
                    onClick={() => setShowSearch(false)}
                >
                    <XMarkIcon className={styles.closeButtonIcon} />
                </button>

                <div>
                    <SearchSelect
                        options={options}
                        selected={search}
                        updateSelected={updateSelected}
                    />
                </div>
            </div>
        </div>
    )
}

export default NounListPageSearch
