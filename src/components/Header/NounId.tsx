'use client'

import { usePathname, useParams } from 'next/navigation'
import { useMemo } from 'react'
import { ChevronRightIcon } from '@heroicons/react/24/solid'

export default function HeaderNounId() {
    const pathname = usePathname()
    const params = useParams()

    const project = useMemo(() => {
        return pathname.includes('/lils') ? 'Lil' : 'Noun'
    }, [pathname])

    return (
        <div className="flex items-center space-x-0.5 text-[#6C6C6C] text-[13px] uppercase">
            <span>{project}</span>

            <ChevronRightIcon className="h-3 w-3" />

            <span>{params.id}</span>
        </div>
    )
}
