'use client'

import useHref from '@/utils/hooks/useHref'
import { useRouter } from 'next/navigation'

export default function Page() {
    const { nounsLink } = useHref()

    const router = useRouter()

    router.push(nounsLink)

    return <div></div>
}
