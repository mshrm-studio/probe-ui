'use client'

import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Project from '@/utils/dto/Project'
import styles from '@/utils/styles/nounListPageSearch.module.css'
import { XMarkIcon } from '@heroicons/react/24/solid'
import RequestingContext from '@/utils/contexts/RequestingContext'
import SearchSelect from '@/components/SearchSelect/SearchSelect'
import SelectValue from '@/utils/dto/SelectValue'
import useNounTraitList from '@/utils/hooks/useNounTraitList'

type Props = {
    project: Project
    setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
}

const NounListPageSearch: React.FC<Props> = ({ project, setShowSearch }) => {
    const { requesting } = useContext(RequestingContext)
    const router = useRouter()
    const searchParams = useSearchParams()
    const [selected, setSelected] = useState<SelectValue>(
        searchParams.get('search') || ''
    )
    const { traitListOptions } = useNounTraitList()

    useEffect(() => {
        const incumbentSearch = searchParams.get('search')

        if (incumbentSearch) {
            const matchingOption = traitListOptions.find(
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
                        options={traitListOptions}
                        selected={selected}
                        setSelected={setSelected}
                    />
                </div>
            </div>
        </div>
    )
}

export default NounListPageSearch
