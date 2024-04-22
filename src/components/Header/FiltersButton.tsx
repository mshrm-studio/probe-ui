import { Londrina_Solid } from 'next/font/google'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { useContext } from 'react'
import ShowExplorePageFiltersContext from '@/utils/contexts/ShowExplorePageFiltersContext'
import styles from '@/utils/styles/header.module.css'

const londrinaSolid = Londrina_Solid({
    subsets: ['latin'],
    weight: '900',
})

export default function HeaderFiltersButton() {
    const { setShow } = useContext(ShowExplorePageFiltersContext)

    return (
        <button
            type="button"
            className="flex items-center"
            onClick={() => setShow((prev) => !prev)}
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
