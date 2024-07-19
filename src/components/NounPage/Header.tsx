'use client'

import { usePathname, useParams } from 'next/navigation'
import { useMemo } from 'react'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import Header from '@/components/Header/Header'
import Link from 'next/link'
import styles from '@/utils/styles/header.module.css'
import useHref from '@/utils/services/useHref'

export default function NounPageHeader() {
    const pathname = usePathname()
    const params = useParams()
    const { lilsLink, nounsLink } = useHref()

    const explorePageLink = useMemo(() => {
        return pathname.includes('/lils') ? lilsLink : nounsLink
    }, [pathname])

    const project = useMemo(() => {
        return pathname.includes('/lils') ? 'Lil' : 'Noun'
    }, [pathname])

    return (
        <Header>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-0.5 text-[#6C6C6C] text-[13px] uppercase">
                    <span>{project}</span>

                    <ChevronRightIcon className="h-3 w-3" />

                    <span>{params.id}</span>
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
        </Header>
    )
}
