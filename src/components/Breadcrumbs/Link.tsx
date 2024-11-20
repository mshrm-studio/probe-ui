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

    const hrefPathname = new URL(href, 'http://localhost').pathname

    const isActive = pathname === hrefPathname

    return (
        <Link href={href} data-active={isActive} className={styles.link}>
            {children}
        </Link>
    )
}
