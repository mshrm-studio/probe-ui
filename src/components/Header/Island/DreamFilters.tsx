'use client'

import { useRef, useState } from 'react'
import styles from '@/utils/styles/header/island/flyOut.module.css'
import useOutsideClick from '@/utils/hooks/useClickOutside'
import Filters from '@/app/nouns/dreams/_components/Filters'
import { usePathname } from 'next/navigation'
import SpacesImage from '@/components/SpacesImage'

export default function HeaderIslandDreamFilters() {
    const pathname = usePathname()

    const [showFilters, setShowFilters] = useState(false)

    const filtersRef = useRef<HTMLDivElement>(null)

    useOutsideClick(filtersRef, () => setShowFilters(false))

    if (pathname !== '/nouns/dreams') return null

    return (
        <div ref={filtersRef}>
            <button onClick={() => setShowFilters((value) => !value)}>
                <SpacesImage src="header/filter.svg" />
            </button>

            {showFilters && (
                <div className={`${styles.flyOut} ${styles.search}`}>
                    <Filters />
                </div>
            )}
        </div>
    )
}
