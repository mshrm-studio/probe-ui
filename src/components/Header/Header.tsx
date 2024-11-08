'use client'

import Logo from '@/components/Logo'
import { usePathname } from 'next/navigation'
import useHref from '@/utils/services/useHref'
import React, { useMemo } from 'react'
import Link from 'next/link'

const Header: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    const { lilsLink, nounsLink } = useHref()

    const pathname = usePathname()

    const explorePageLink = useMemo(() => {
        return pathname.includes('/lils') ? lilsLink : nounsLink
    }, [pathname])

    return (
        <header className="p-4 relative z-[999] flex items-center">
            <div className="mr-6">
                <Link href={explorePageLink}>
                    <Logo className="h-[24px] w-[24px]" />
                </Link>
            </div>

            <div className="flex-grow">{children}</div>
        </header>
    )
}

export default Header
