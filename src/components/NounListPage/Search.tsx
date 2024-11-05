'use client'

import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Project from '@/utils/dto/Project'
import styles from '@/utils/styles/nounListPageSearch.module.css'
import { XMarkIcon } from '@heroicons/react/24/solid'
import RequestingContext from '@/utils/contexts/RequestingContext'
import SearchSelect from '@/components/SearchSelect/SearchSelect'
import { startCase } from 'lodash'
import SearchSelectSelected from '@/utils/dto/SearchSelectSelected'
import NounTraitsContext from '@/utils/contexts/NounTraitsContext'

type Props = {
    project: Project
    setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
}

const NounListPageSearch: React.FC<Props> = ({ project, setShowSearch }) => {
    const { requesting } = useContext(RequestingContext)
    const router = useRouter()
    const searchParams = useSearchParams()
    const [selected, setSelected] = useState<SearchSelectSelected>(
        searchParams.get('search') || ''
    )
    const { accessoryList, bodyList, glassesList, headList } =
        useContext(NounTraitsContext)

    useEffect(() => {
        const incumbentSearch = searchParams.get('search')

        if (incumbentSearch) {
            const matchingOption = options.find(
                (o) => o.value === incumbentSearch
            )

            if (matchingOption) {
                setSelected(matchingOption.value)
            }
        }
    }, [searchParams])

    const basePath = useMemo(() => {
        return project === 'Nouns' ? '/nouns' : '/lils'
    }, [project])

    const pushToNewQuery = (search: string) => {
        const incumbentSearch = searchParams.get('search') || ''

        if (search !== '' && search !== incumbentSearch) {
            const newSearchParams = new URLSearchParams(searchParams.toString())

            if (search !== '') {
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
    }

    useEffect(() => {
        pushToNewQuery(typeof selected === 'string' ? selected : '')
    }, [selected])

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

    const closeSearch = () => {
        const search = selected || ''

        if (search === '') {
            const newSearchParams = new URLSearchParams(searchParams.toString())

            newSearchParams.delete('search')

            router.push(`${basePath}?${newSearchParams.toString()}`)
        }

        setShowSearch(false)
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <button
                    type="button"
                    className={styles.closeButton}
                    onClick={closeSearch}
                >
                    <XMarkIcon className={styles.closeButtonIcon} />
                </button>

                <div className="w-full md:w-[377px]">
                    <SearchSelect
                        disabled={requesting}
                        label="Search"
                        options={options}
                        selected={selected}
                        setSelected={setSelected}
                    />
                </div>
            </div>
        </div>
    )
}

export default NounListPageSearch
