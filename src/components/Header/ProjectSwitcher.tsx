'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import styles from '@/utils/styles/header.module.css'

export default function HeaderProjectSwitcher() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    return (
        <div className="flex items-center space-x-6">
            <Link
                href={`/nouns?${searchParams.toString()}`}
                className={styles.projectSwitcherLink}
                data-state={pathname === '/nouns' ? 'active' : 'inactive'}
            >
                Nouns
            </Link>

            <Link
                href={`/lils?${searchParams.toString()}`}
                className={styles.projectSwitcherLink}
                data-state={pathname === '/lils' ? 'active' : 'inactive'}
            >
                Lils
            </Link>
        </div>
    )
}
