import { ChevronDownIcon } from '@heroicons/react/24/solid'
import React from 'react'
import styles from '@/styles/header/header.module.css'

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
            <span className={styles.filterSortBtn}>Filters</span>

            <ChevronDownIcon className={styles.filterSortBtnIcon} />
        </button>
    )
}
