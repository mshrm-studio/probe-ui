'use client'

import SpacesImage from '@/components/SpacesImage'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import useHref from '@/utils/services/useHref'
import { useContext, useMemo } from 'react'
import Link from 'next/link'
import { Londrina_Solid } from 'next/font/google'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import DimensionsContext from '@/utils/contexts/DimensionsContext'
import ShowExplorePageFiltersContext from '@/utils/contexts/ShowExplorePageFiltersContext'
import styles from '@/utils/styles/header.module.css'

const londrinaSolid = Londrina_Solid({
    subsets: ['latin'],
    weight: '900',
})

export default function Header() {
    const { lilsLink, nounsLink } = useHref()
    const router = useRouter()
    const pathname = usePathname()
    const { dimensions } = useContext(DimensionsContext)
    const { setShow } = useContext(ShowExplorePageFiltersContext)
    const searchParams = useSearchParams()

    const explorePageLink = useMemo(() => {
        return pathname.includes('/lils') ? lilsLink : nounsLink
    }, [pathname])

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

    const showExplorePageFilters = useMemo(() => {
        return (
            dimensions.viewportWidth >= 1280 &&
            (pathname === '/lils' || pathname === '/nouns')
        )
    }, [dimensions.viewportWidth, pathname])

    const showFiltersButton = useMemo(() => {
        return (
            dimensions.viewportWidth < 1280 &&
            (pathname === '/lils' || pathname === '/nouns')
        )
    }, [dimensions.viewportWidth, pathname])

    const showProjectSwitcher = useMemo(() => {
        return pathname === '/lils' || pathname === '/nouns' ? true : false
    }, [pathname])

    function updateSort(label: string) {
        const params = new URLSearchParams(searchParams)

        params.set(
            'sort_property',
            label === 'Heaviest' || label === 'Lightest' ? 'weight' : 'token_id'
        )

        params.set(
            'sort_method',
            label === 'Heaviest' || label === 'Most Recent' ? 'desc' : 'asc'
        )

        router.push(`${pathname}?${params.toString()}`)
    }

    function resetFilters() {
        router.push(explorePageLink)
    }

    return (
        <header className={`${londrinaSolid.className} p-4`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <div>
                        <Link href={explorePageLink}>
                            <SpacesImage
                                src="Probe_Logo.svg"
                                alt="Probe Logo"
                                className="h-[24px] w-[24px]"
                            />
                        </Link>
                    </div>

                    {showFiltersButton && (
                        <div>
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

                                <ChevronDownIcon
                                    className={styles.filterSortBtnIcon}
                                />
                            </button>
                        </div>
                    )}

                    {showExplorePageFilters && (
                        <div className="flex items-center space-x-6">
                            <div>
                                <button
                                    type="button"
                                    className="flex items-center"
                                    onClick={resetFilters}
                                >
                                    <span
                                        className={`${londrinaSolid.className} ${styles.filterSortBtn}`}
                                    >
                                        Reset
                                    </span>

                                    <ChevronRightIcon
                                        className={styles.filterSortBtnIcon}
                                    />
                                </button>
                            </div>

                            <div>
                                <button
                                    type="button"
                                    className="flex items-center"
                                    onClick={() => updateSort(tokenIdSortLabel)}
                                >
                                    <span
                                        className={`${londrinaSolid.className} ${styles.filterSortBtn}`}
                                    >
                                        {tokenIdSortLabel}
                                    </span>

                                    <ChevronRightIcon
                                        className={styles.filterSortBtnIcon}
                                    />
                                </button>
                            </div>

                            <div>
                                <button
                                    type="button"
                                    className="flex items-center"
                                    onClick={() => updateSort(weightSortLabel)}
                                >
                                    <span
                                        className={`${londrinaSolid.className} ${styles.filterSortBtn}`}
                                    >
                                        {weightSortLabel}
                                    </span>

                                    <ChevronRightIcon
                                        className={styles.filterSortBtnIcon}
                                    />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {showProjectSwitcher ? (
                    <div className="flex items-center space-x-6">
                        <Link
                            href={`/nouns?${searchParams.toString()}`}
                            className={styles.projectSwitcherLink}
                            data-state={
                                pathname === '/nouns' ? 'active' : 'inactive'
                            }
                        >
                            Nouns
                        </Link>

                        <Link
                            href={`/lils?${searchParams.toString()}`}
                            className={styles.projectSwitcherLink}
                            data-state={
                                pathname === '/lils' ? 'active' : 'inactive'
                            }
                        >
                            Lils
                        </Link>
                    </div>
                ) : (
                    <div>
                        <Link
                            href={explorePageLink}
                            className={styles.projectSwitcherLink}
                        >
                            Explore
                        </Link>
                    </div>
                )}
            </div>
        </header>
    )
}
