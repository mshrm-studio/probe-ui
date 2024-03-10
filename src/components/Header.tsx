'use client'

import SpacesImage from '@/components/SpacesImage'
import { usePathname } from 'next/navigation'
import useHref from '@/utils/services/useHref'
import { useMemo } from 'react'
import Link from 'next/link'
import { Londrina_Solid } from 'next/font/google'

const londrinaSolid = Londrina_Solid({
    subsets: ['latin'],
    weight: '900',
})

export default function Header() {
    const { lilsLink, nounsLink } = useHref()
    const pathname = usePathname()

    const homeHref = useMemo(() => {
        return pathname.includes('/lils') ? lilsLink : nounsLink
    }, [pathname])

    return (
        <header className={`${londrinaSolid.className} px-6 py-4`}>
            <Link href={homeHref}>
                <SpacesImage
                    src={'nouns/glasses-square-red.png'}
                    alt="Glasses Square Red"
                />
            </Link>
        </header>
    )
}
