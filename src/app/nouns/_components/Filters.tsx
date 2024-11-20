'use client'

import SelectNounTrait from '@/components/Select/NounTrait'
import { nounTraitLayers } from '@/utils/dto/NounTraitLayer'
import { useContext } from 'react'
import styles from '@/app/nouns/_styles/filters.module.css'
import FilterDisplayContext from '@/utils/contexts/FilterDisplayContext'
import SelectNounColor from '@/components/Select/NounColor'
import NounFilters from '@/utils/dto/NounFilters'

type Props = {
    filters: NounFilters
    setFilters: React.Dispatch<React.SetStateAction<NounFilters>>
}

export default function Filters({ filters, setFilters }: Props) {
    const { show } = useContext(FilterDisplayContext)

    if (!show) return null

    return (
        <div className={styles.filters}>
            <div className={styles.filter}>
                <SelectNounColor
                    selected={filters.color}
                    setSelected={(value) =>
                        setFilters({ ...filters, color: value })
                    }
                />
            </div>

            {nounTraitLayers.map((layer) => (
                <div key={layer} className={styles.filter}>
                    <SelectNounTrait
                        layer={layer}
                        selected={filters[layer]}
                        setSelected={(value) =>
                            setFilters({
                                ...filters,
                                [layer]:
                                    typeof value === 'string'
                                        ? value
                                        : undefined,
                            })
                        }
                        valueKey="name"
                    />
                </div>
            ))}
        </div>
    )
}
