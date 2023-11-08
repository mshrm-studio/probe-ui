'use client'
import useHref from '@/utils/services/useHref'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
    const { lilsLink } = useHref()

    const router = useRouter()

    useEffect(() => {
        router.push(lilsLink)
    }, [])

    return <div></div>
}
