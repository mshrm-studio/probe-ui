'use client'

import { ChevronRightIcon } from '@heroicons/react/24/solid'
import styles from '@/styles/header/header.module.css'
import { useContext, useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import RequestingContext from '@/utils/contexts/RequestingContext'
import useHref from '@/utils/hooks/useHref'

export default function NounListPageSorters() {
    const { requesting } = useContext(RequestingContext)
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { lilsLink, nounsLink } = useHref()
    const explorePageLink = useMemo(() => {
        return pathname.includes('/lils') ? lilsLink : nounsLink
    }, [pathname])

    const areaSortLabel = useMemo(() => {
        return searchParams?.get('sort_property') !== 'area'
            ? 'Biggest'
            : searchParams?.get('sort_method') === 'asc'
            ? 'Biggest'
            : 'Smallest'
    }, [searchParams])

    const tokenIdSortLabel = useMemo(() => {
        return searchParams?.get('sort_property') !== 'token_id'
            ? 'Most Recent'
            : searchParams?.get('sort_method') === 'asc'
            ? 'Most Recent'
            : 'Oldest'
    }, [searchParams])

    const weightSortLabel = useMemo(() => {
        return searchParams?.get('sort_property') !== 'weight'
            ? 'Brightest'
            : searchParams?.get('sort_method') === 'asc'
            ? 'Brightest'
            : 'Darkest'
    }, [searchParams])

    function updateSort(label: string) {
        const params = new URLSearchParams(searchParams)

        params.set(
            'sort_property',
            label === 'Brightest' || label === 'Darkest'
                ? 'weight'
                : label === 'Biggest' || label === 'Smallest'
                ? 'area'
                : 'token_id'
        )

        params.set(
            'sort_method',
            label === 'Brightest' ||
                label === 'Most Recent' ||
                label === 'Biggest'
                ? 'desc'
                : 'asc'
        )

        router.push(`${pathname}?${params.toString()}`)
    }

    function resetFilters() {
        router.push(explorePageLink)
    }

    return (
        <div className="flex items-center space-x-6">
            <div>
                <button
                    disabled={requesting}
                    type="button"
                    className="flex items-center"
                    onClick={resetFilters}
                >
                    <span className={styles.filterSortBtn}>Reset</span>

                    <ChevronRightIcon className={styles.filterSortBtnIcon} />
                </button>
            </div>

            <div>
                <button
                    disabled={requesting}
                    type="button"
                    className="flex items-center"
                    onClick={() => updateSort(tokenIdSortLabel)}
                >
                    <span className={styles.filterSortBtn}>
                        {tokenIdSortLabel}
                    </span>

                    <ChevronRightIcon className={styles.filterSortBtnIcon} />
                </button>
            </div>

            <div>
                <button
                    disabled={requesting}
                    type="button"
                    className="flex items-center"
                    onClick={() => updateSort(weightSortLabel)}
                >
                    <span className={styles.filterSortBtn}>
                        {weightSortLabel}
                    </span>

                    <ChevronRightIcon className={styles.filterSortBtnIcon} />
                </button>
            </div>

            <div>
                <button
                    disabled={requesting}
                    type="button"
                    className="flex items-center"
                    onClick={() => updateSort(areaSortLabel)}
                >
                    <span className={styles.filterSortBtn}>
                        {areaSortLabel}
                    </span>

                    <ChevronRightIcon className={styles.filterSortBtnIcon} />
                </button>
            </div>
        </div>
    )
}
