'use client'

import { ChevronRightIcon } from '@heroicons/react/24/solid'
import styles from '@/utils/styles/header.module.css'
import { useContext, useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Londrina_Solid } from 'next/font/google'
import RequestingContext from '@/utils/contexts/RequestingContext'

const londrinaSolid = Londrina_Solid({
    subsets: ['latin'],
    weight: '900',
})

export default function HeaderExplorePageFilters({
    explorePageLink,
}: {
    explorePageLink: string
}) {
    const { requesting } = useContext(RequestingContext)
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

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
            ? 'Heaviest'
            : searchParams?.get('sort_method') === 'asc'
            ? 'Heaviest'
            : 'Lightest'
    }, [searchParams])

    function updateSort(label: string) {
        const params = new URLSearchParams(searchParams)

        params.set(
            'sort_property',
            label === 'Heaviest' || label === 'Lightest'
                ? 'weight'
                : label === 'Biggest' || label === 'Smallest'
                ? 'area'
                : 'token_id'
        )

        params.set(
            'sort_method',
            label === 'Heaviest' ||
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
                    <span
                        className={`${londrinaSolid.className} ${styles.filterSortBtn}`}
                    >
                        Reset
                    </span>

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
                    <span
                        className={`${londrinaSolid.className} ${styles.filterSortBtn}`}
                    >
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
                    <span
                        className={`${londrinaSolid.className} ${styles.filterSortBtn}`}
                    >
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
                    <span
                        className={`${londrinaSolid.className} ${styles.filterSortBtn}`}
                    >
                        {areaSortLabel}
                    </span>

                    <ChevronRightIcon className={styles.filterSortBtnIcon} />
                </button>
            </div>
        </div>
    )
}
