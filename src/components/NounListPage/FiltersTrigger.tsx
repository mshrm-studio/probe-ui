import { Londrina_Solid } from 'next/font/google'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import React from 'react'
import styles from '@/utils/styles/header.module.css'

const londrinaSolid = Londrina_Solid({
    subsets: ['latin'],
    weight: '900',
})

type Props = {
    setShowFilters: React.Dispatch<React.SetStateAction<boolean>>
}

export default function NounListPageFiltersTrigger({ setShowFilters }: Props) {
    return (
        <button
            type="button"
            className="flex items-center"
            onClick={() => setShowFilters((prev) => !prev)}
        >
            <span
                className={`${londrinaSolid.className} ${styles.filterSortBtn}`}
            >
                Filters
            </span>

            <ChevronDownIcon className={styles.filterSortBtnIcon} />
        </button>
    )
}
