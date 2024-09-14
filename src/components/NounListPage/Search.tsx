'use client'

import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Project from '@/utils/dto/Project'
import styles from '@/utils/styles/nounListPageSearch.module.css'
import { XMarkIcon } from '@heroicons/react/24/solid'
import RequestingContext from '@/utils/contexts/RequestingContext'
import SearchSelect from '@/components/SearchSelect'
import { startCase } from 'lodash'
import NounTrait from '@/utils/dto/NounTrait'

type Props = {
    accessoryList: NounTrait[]
    bodyList: NounTrait[]
    glassesList: NounTrait[]
    headList: NounTrait[]
    project: Project
    setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
}

const NounListPageSearch: React.FC<Props> = ({
    accessoryList,
    bodyList,
    glassesList,
    headList,
    project,
    setShowSearch,
}) => {
    const { requesting } = useContext(RequestingContext)
    const router = useRouter()
    const searchParams = useSearchParams()
    const [search, setSearch] = useState('')

    useEffect(() => {
        const incumbentSearch = searchParams.get('search')

        if (incumbentSearch) {
            const matchingOption = options.find(
                (o) => o.value === incumbentSearch
            )

            if (matchingOption) {
                setSearch(matchingOption.label)
            }
        }
    }, [searchParams])

    const updateSelected = (value?: string | number) => {
        if (typeof value === 'string') {
            pushToNewQuery(value)
        } else {
            pushToNewQuery()
        }
    }

    const options = useMemo(() => {
        const listOfAllLayers = [
            ...accessoryList,
            ...bodyList,
            ...glassesList,
            ...headList,
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

    const pushToNewQuery = (search?: string) => {
        const basePath = project === 'Nouns' ? '/nouns' : '/lils'

        const newSearchParams = new URLSearchParams(searchParams.toString())

        if (search) {
            newSearchParams.set('search', search)
        } else {
            newSearchParams.delete('search')
        }

        newSearchParams.delete('accessory')
        newSearchParams.delete('body')
        newSearchParams.delete('glasses')
        newSearchParams.delete('head')

        router.push(`${basePath}?${newSearchParams.toString()}`)

        setShowSearch(false)
    }

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
                        disabled={requesting}
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
