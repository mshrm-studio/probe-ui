'use client'

import { ChevronRightIcon } from '@heroicons/react/24/solid'
import styles from '@/app/nouns/_styles/sorters.module.css'
import { useContext, useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import NounFilters from '@/utils/dto/NounFilters'
import FilterDisplayContext from '@/utils/contexts/FilterDisplayContext'
import useHref from '@/utils/hooks/useHref'

type Props = {
    filters: NounFilters
    setFilters: React.Dispatch<React.SetStateAction<NounFilters>>
}

export default function NounListPageSorters({ filters, setFilters }: Props) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { lilsLink, nounsLink } = useHref()

    const sortOptions = useMemo(() => {
        const areaLabel =
            searchParams?.get('sort_property') !== 'area'
                ? 'Biggest'
                : searchParams?.get('sort_method') === 'asc'
                ? 'Biggest'
                : 'Smallest'

        const colorfulnessLabel =
            searchParams?.get('sort_property') !== 'colorfulness'
                ? 'Most Colorful'
                : searchParams?.get('sort_method') === 'asc'
                ? 'Most Colorful'
                : 'Least Colorful'

        const tokenIdLabel =
            searchParams?.get('sort_property') !== 'token_id'
                ? 'Most Recent'
                : searchParams?.get('sort_method') === 'asc'
                ? 'Most Recent'
                : 'Oldest'

        const weightLabel =
            searchParams?.get('sort_property') !== 'weight'
                ? 'Brightest'
                : searchParams?.get('sort_method') === 'asc'
                ? 'Brightest'
                : 'Darkest'

        return [
            {
                label: areaLabel,
                property: 'area',
                method: areaLabel === 'Biggest' ? 'desc' : 'asc',
            },
            {
                label: colorfulnessLabel,
                property: 'colorfulness',
                method: colorfulnessLabel === 'Most Colorful' ? 'desc' : 'asc',
            },
            {
                label: tokenIdLabel,
                property: 'token_id',
                method: tokenIdLabel === 'Most Recent' ? 'desc' : 'asc',
            },
            {
                label: weightLabel,
                property: 'weight',
                method: weightLabel === 'Brightest' ? 'desc' : 'asc',
            },
        ]
    }, [searchParams])

    function resetFilters() {
        router.replace(pathname === '/nouns' ? nounsLink : lilsLink)
    }

    const { show } = useContext(FilterDisplayContext)

    if (!show) return null

    return (
        <div className="flex items-center space-x-4">
            <div>
                <button
                    type="button"
                    className={styles.button}
                    onClick={resetFilters}
                >
                    <span>Reset</span>

                    <ChevronRightIcon className={styles.buttonIcon} />
                </button>
            </div>

            {sortOptions.map((option) => (
                <div key={option.property}>
                    <button
                        type="button"
                        className={styles.button}
                        onClick={() =>
                            setFilters((prev) => ({
                                ...prev,
                                sort_property: option.property,
                                sort_method: option.method,
                            }))
                        }
                    >
                        <span>{option.label}</span>

                        <ChevronRightIcon className={styles.buttonIcon} />
                    </button>
                </div>
            ))}
        </div>
    )
}
