'use client'

import { usePathname, useParams } from 'next/navigation'
import { useContext, useMemo } from 'react'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import styles from '@/app/nouns/[id]/_styles/header.module.css'
import useHref from '@/utils/hooks/useHref'
import AuctionContext from '@/utils/contexts/AuctionContext'
import Logo from '@/components/Logo'

export default function NounPageHeader() {
    const pathname = usePathname()
    const params = useParams()
    const { dreamsLink, lilsLink, nounsLink } = useHref()
    const { auction } = useContext(AuctionContext)

    const explorePageLink = useMemo(() => {
        return pathname.includes('/dreams')
            ? dreamsLink
            : pathname.includes('/lils')
            ? lilsLink
            : nounsLink
    }, [dreamsLink, lilsLink, nounsLink, pathname])

    const project = useMemo(() => {
        return pathname.includes('/dreams')
            ? 'Dream'
            : pathname.includes('/lils')
            ? 'Lil'
            : 'Noun'
    }, [pathname])

    return (
        <header className="p-4 relative z-[999] flex items-center">
            <div className="mr-6">
                <Link href={explorePageLink}>
                    <Logo className="h-[24px] w-[24px]" />
                </Link>
            </div>

            <div className="flex-grow">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-0.5 text-[13px]">
                        <Link href={explorePageLink}>{project}</Link>

                        <ChevronRightIcon className="h-3 w-3" />

                        <span>{params.id || auction?.nounId}</span>
                    </div>

                    <div>
                        <Link
                            href={explorePageLink}
                            className={styles.projectSwitcherLink}
                        >
                            Explore
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}
