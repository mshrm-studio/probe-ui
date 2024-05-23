'use client'

import React, { useMemo } from 'react'
import Noun from '@/utils/dto/Noun'
import { DateTime } from 'luxon'
import Link from 'next/link'
import useHref from '@/utils/services/useHref'
import { usePathname } from 'next/navigation'

type Props = {
    className?: string
    histogram: Record<string, number>
}

const NounColorHistogram: React.FC<Props> = ({ className = '', histogram }) => {
    const { lilsLink, nounsLink } = useHref()

    const pathname = usePathname()

    const listHref = useMemo(() => {
        return pathname.includes('/lils') ? lilsLink : nounsLink
    }, [pathname])

    return (
        <ul className={className}>
            {Object.entries(histogram).map(([color, weight], index) => (
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
