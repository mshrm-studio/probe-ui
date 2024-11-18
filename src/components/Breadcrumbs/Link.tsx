'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from '@/styles/breadcrumbs.module.css'

type Props = {
    children: React.ReactNode
    href: string
}

export default function BreadcrumbItem({ children, href }: Props) {
    const pathname = usePathname()

    return (
        <Link
            href={href}
            data-active={pathname === href}
            className={styles.link}
        >
            {children}
        </Link>
    )
}
