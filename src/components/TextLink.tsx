'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'

type Props = {
    children: React.ReactNode
    href: string
}

const TextLink: React.FC<Props> = ({ children, href }) => {
    const className = 'text-[#2B83F6] font-bold underline'

    const cleanedHref = useMemo(() => {
        return href.startsWith(`/`) || href.startsWith('http')
            ? href
            : `/${href}`
    }, [href])

    if (cleanedHref.startsWith('http'))
        return (
            <a href={cleanedHref} className={className} target="_blank">
                {children}
            </a>
        )

    return (
        <Link href={cleanedHref} className={className}>
            {children}
        </Link>
    )
}

export default TextLink
