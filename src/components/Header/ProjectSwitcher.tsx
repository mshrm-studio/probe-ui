'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import styles from '@/utils/styles/header.module.css'
import { useContext } from 'react'
import RequestingContext from '@/utils/contexts/RequestingContext'

export default function HeaderProjectSwitcher() {
    const { requesting } = useContext(RequestingContext)
    const pathname = usePathname()
    const searchParams = useSearchParams()

    return (
        <div className="flex items-center space-x-6">
            <Link
                href={`/nouns?${searchParams.toString()}`}
                aria-disabled={requesting}
                className={styles.projectSwitcherLink}
                data-state={pathname === '/nouns' ? 'active' : 'inactive'}
            >
                Nouns
            </Link>

            <Link
                href={`/lils?${searchParams.toString()}`}
                aria-disabled={requesting}
                className={styles.projectSwitcherLink}
                data-state={pathname === '/lils' ? 'active' : 'inactive'}
            >
                Lils
            </Link>
        </div>
    )
}
