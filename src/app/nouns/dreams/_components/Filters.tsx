'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function Filters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString())

        if (e.target.value === '') {
            params.delete('accessory_seed_id')
        } else {
            params.set('accessory_seed_id', e.target.value)
        }

        router.push(`?${params.toString()}`)
    }

    return (
        <select onChange={handleSelectChange} defaultValue="">
            <option value="">Select a seed</option>

            <option value="1">seed id 1</option>

            <option value="2">seed id 2</option>
        </select>
    )
}
