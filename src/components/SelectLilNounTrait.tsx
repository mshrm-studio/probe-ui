'use client'
import React, { ChangeEvent, useEffect, useMemo } from 'react'
import { LilNounTraitLayer } from '@/utils/dto/LilNounTraitLayer'
import useLilNounTraitList from '@/utils/services/useLilNounTraitList'
import { debounce, startCase } from 'lodash'
import styles from '@/utils/styles/lilNounFilters.module.css'

type Props = {
    layer: LilNounTraitLayer
    selected?: string
    updateSelected: (e: ChangeEvent<HTMLSelectElement>) => void
}

const SelectLilNounTrait: React.FC<Props> = ({
    layer,
    selected,
    updateSelected,
}) => {
    const { fetchLilNounTraitList, lilNounTraitList } = useLilNounTraitList()

    useEffect(() => {
        const debouncedFetch = debounce(() => {
            const params = new URLSearchParams()
            params.set('layer', layer)
            fetchLilNounTraitList(params)
        }, 500)

        debouncedFetch()

        return () => debouncedFetch.cancel()
    }, [layer])

    const filteredList = useMemo(() => {
        return lilNounTraitList
            ? lilNounTraitList
                  .map((item) => ({
                      label:
                          item.layer === 'background'
                              ? item.name.replace(new RegExp(`^${layer}-`), '')
                              : startCase(
                                    item.name.replace(
                                        new RegExp(`^${layer}-`),
                                        ''
                                    )
                                ),
                      value: item.name,
                  }))
                  .reduce((unique, item) => {
                      return unique.some((uItem) => uItem.value === item.value)
                          ? unique
                          : [...unique, item]
                  }, [] as { label: string; value: string }[])
            : []
    }, [lilNounTraitList])

    return (
        <div className={styles.container}>
            <label className={styles.label} htmlFor={layer}>
                {startCase(layer)}
            </label>

            <select
                className={styles.select}
                name={layer}
                id={layer}
                value={selected}
                onChange={updateSelected}
            >
                <option value="">Any</option>

                {filteredList.map((item) => (
                    <option key={item.value} value={item.value}>
                        {item.label}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default SelectLilNounTrait
