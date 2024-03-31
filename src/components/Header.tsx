'use client'

import SpacesImage from '@/components/SpacesImage'
import { usePathname } from 'next/navigation'
import useHref from '@/utils/services/useHref'
import { useContext, useMemo } from 'react'
import Link from 'next/link'
import { Londrina_Solid } from 'next/font/google'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import DimensionsContext from '@/utils/contexts/DimensionsContext'
import ShowExplorePageFiltersContext from '@/utils/contexts/ShowExplorePageFiltersContext'

const londrinaSolid = Londrina_Solid({
    subsets: ['latin'],
    weight: '900',
})

export default function Header() {
    const { lilsLink, nounsLink } = useHref()
    const pathname = usePathname()
    const { dimensions } = useContext(DimensionsContext)
    const { setShow } = useContext(ShowExplorePageFiltersContext)

    const homeHref = useMemo(() => {
        return pathname.includes('/lils') ? lilsLink : nounsLink
    }, [pathname])

    const showFiltersButton = useMemo(() => {
        return (
            dimensions.viewportWidth < 1280 &&
            (pathname.includes('/lils') || pathname.includes('/nouns'))
        )
    }, [dimensions.viewportWidth, pathname])

    return (
        <header className={`${londrinaSolid.className} p-3`}>
            <div className="flex items-center space-x-6">
                <div>
                    <Link href={homeHref}>
                        <SpacesImage
                            src="Probe_Logo.svg"
                            alt="Probe Logo"
                            className="h-[48px] w-[48px]"
                        />
                    </Link>
                </div>

                {showFiltersButton && (
                    <div>
                        <button
                            type="button"
                            className="flex items-center space-x-1"
                            onClick={() => setShow((prev) => !prev)}
                        >
                            <span
                                className={`${londrinaSolid.className} text-[13px] uppercase text-[#6C6C6C]`}
                            >
                                Filters
                            </span>

                            <ChevronDownIcon className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}
