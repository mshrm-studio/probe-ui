'use client'

import SearchSelectNounTrait from '@/components/SearchSelect/NounTrait'
import { nounTraitLayers } from '@/utils/dto/NounTraitLayer'
import { useRouter, useSearchParams } from 'next/navigation'
import DreamFilters from '@/utils/dto/DreamFilters'
import { useCallback, useEffect, useMemo, useState } from 'react'

export default function Filters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const initializeFilters = useCallback(
        () => ({
            accessory_seed_id:
                Number(searchParams.get('accessory')) || undefined,
            background_seed_id:
                Number(searchParams.get('background')) || undefined,
            body_seed_id: Number(searchParams.get('body')) || undefined,
            glasses_seed_id: Number(searchParams.get('glasses')) || undefined,
            head_seed_id: Number(searchParams.get('head')) || undefined,
        }),
        [searchParams]
    )

    const [filters, setFilters] = useState<DreamFilters>(initializeFilters())

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())

        Object.entries(filters).forEach(([key, value]) => {
            if (value === undefined) {
                params.delete(key)
            } else {
                params.set(key, value.toString())
            }
        })

        router.push(`?${params.toString()}`)
    }, [filters, router, searchParams])

    const mappedNounTraitLayers = nounTraitLayers.map((layer) => ({
        name: layer,
        filterKey: `${layer}_seed_id` as keyof DreamFilters,
    }))

    return (
        <div>
            {mappedNounTraitLayers.map((layer) => (
                <SearchSelectNounTrait
                    key={layer.name}
                    layer={layer.name}
                    selected={filters[layer.filterKey]}
                    setSelected={(value) =>
                        setFilters({
                            ...filters,
                            [layer.filterKey]:
                                typeof value === 'number' ? value : undefined,
                        })
                    }
                    valueKey="seed_id"
                />
            ))}
        </div>
    )
}
