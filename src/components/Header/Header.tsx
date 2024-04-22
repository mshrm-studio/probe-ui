'use client'

import Logo from '@/components/Logo'
import { usePathname, useRouter } from 'next/navigation'
import useHref from '@/utils/services/useHref'
import { useContext, useMemo } from 'react'
import Link from 'next/link'
import { Londrina_Solid } from 'next/font/google'
import DimensionsContext from '@/utils/contexts/DimensionsContext'
import styles from '@/utils/styles/header.module.css'
import ExplorePageFilters from '@/components/Header/ExplorePageFilters'
import ProjectSwitcher from '@/components/Header/ProjectSwitcher'
import FiltersButton from '@/components/Header/FiltersButton'
import NounId from '@/components/Header/NounId'

const londrinaSolid = Londrina_Solid({
    subsets: ['latin'],
    weight: '900',
})

export default function Header() {
    const { lilsLink, nounsLink } = useHref()

    const pathname = usePathname()
    const { dimensions } = useContext(DimensionsContext)

    const explorePageLink = useMemo(() => {
        return pathname.includes('/lils') ? lilsLink : nounsLink
    }, [pathname])

    const showNounId = useMemo(() => {
        return pathname.includes('/nouns/') || pathname.includes('/lils/')
    }, [pathname])

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

    return (
        <header className={`${londrinaSolid.className} p-4`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <div>
                        <Link href={explorePageLink}>
                            <Logo className="h-[24px] w-[24px]" />
                        </Link>
                    </div>

                    {showNounId && <NounId />}

                    {showFiltersButton && (
                        <div>
                            <FiltersButton />
                        </div>
                    )}

                    {showExplorePageFilters && (
                        <ExplorePageFilters explorePageLink={explorePageLink} />
                    )}
                </div>

                {showProjectSwitcher ? (
                    <ProjectSwitcher />
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
