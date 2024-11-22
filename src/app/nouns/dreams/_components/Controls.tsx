'use client'

import SelectNounTrait from '@/components/Select/NounTrait'
import { nounTraitLayers } from '@/utils/dto/NounTraitLayer'
import { useRouter, useSearchParams } from 'next/navigation'
import DreamFilters from '@/utils/dto/DreamFilters'
import { useCallback, useContext, useEffect, useState } from 'react'
import styles from '@/app/nouns/dreams/_styles/filters.module.css'
import FilterDisplayContext from '@/utils/contexts/FilterDisplayContext'

export default function Controls() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const initializeFilters = useCallback(
        () => ({
            accessory_seed_id:
                Number(searchParams.get('accessory_seed_id')) || undefined,
            background_seed_id:
                Number(searchParams.get('background_seed_id')) || undefined,
            body_seed_id: Number(searchParams.get('body_seed_id')) || undefined,
            glasses_seed_id:
                Number(searchParams.get('glasses_seed_id')) || undefined,
            head_seed_id: Number(searchParams.get('head_seed_id')) || undefined,
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

        router.replace(`?${params.toString()}`)
    }, [filters, router, searchParams])

    const mappedNounTraitLayers = nounTraitLayers.map((layer) => ({
        name: layer,
        filterKey: `${layer}_seed_id` as keyof DreamFilters,
    }))

    const { show } = useContext(FilterDisplayContext)

    if (!show) return null

    return (
        <div className={styles.filters}>
            {mappedNounTraitLayers.map((layer) => (
                <div key={layer.name}>
                    <SelectNounTrait
                        layer={layer.name}
                        selected={filters[layer.filterKey]}
                        setSelected={(value) =>
                            setFilters({
                                ...filters,
                                [layer.filterKey]:
                                    typeof value === 'number'
                                        ? value
                                        : typeof value === 'string'
                                        ? Number(value)
                                        : undefined,
                            })
                        }
                        valueKey="seed_id"
                    />
                </div>
            ))}
        </div>
    )
}
