'use client'

import { useContext } from 'react'
import { usePathname } from 'next/navigation'
import SpacesImage from '@/components/SpacesImage'
import FilterDisplayContext from '@/utils/contexts/FilterDisplayContext'

export default function HeaderIslandDreamFilters({
    className,
}: {
    className: string
}) {
    const { show, setShow } = useContext(FilterDisplayContext)

    const pathname = usePathname()

    if (pathname !== '/nouns/dreams') return null

    return (
        <li className={className} data-active={show}>
            <button title="Filter" onClick={() => setShow((value) => !value)}>
                <span className="sr-only">Filter</span>

                <SpacesImage
                    src={
                        show ? 'header/filter-active.svg' : 'header/filter.svg'
                    }
                    alt="Filter"
                />
            </button>
        </li>
    )
}
