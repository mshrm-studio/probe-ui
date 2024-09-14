'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import useHref from '@/utils/services/useHref'
import { usePathname } from 'next/navigation'

type Props = {
    className?: string
    bgColorHex: string
    histogram: Record<string, number>
}

const NounColorHistogram: React.FC<Props> = ({
    className = '',
    bgColorHex,
    histogram,
}) => {
    const { lilsLink, nounsLink } = useHref()

    const pathname = usePathname()

    const listHref = useMemo(() => {
        return pathname.includes('/lils') ? lilsLink : nounsLink
    }, [pathname])

    const filteredHistogram = useMemo(() => {
        const { [`#${bgColorHex}`]: _, ...rest } = histogram
        return rest
    }, [histogram, bgColorHex])

    return (
        <ul className={className}>
            {Object.entries(filteredHistogram).map(([color, weight], index) => (
                <li key={`${color}-${index}`}>
                    <Link
                        href={`${listHref}&color=${encodeURIComponent(color)}`}
                        className="block h-6 w-6"
                        style={{
                            backgroundColor: color,
                        }}
                        title={`${color} (${weight})`}
                    ></Link>
                </li>
            ))}
        </ul>
    )
}

export default NounColorHistogram
