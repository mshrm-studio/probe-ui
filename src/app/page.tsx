'use client'

import useHref from '@/utils/hooks/useHref'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
    const { nounsLink } = useHref()

    const router = useRouter()

    useEffect(() => {
        router.push(nounsLink)
    }, [])

    return <div></div>
}
