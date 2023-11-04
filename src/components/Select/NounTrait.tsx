'use client'
import React, { ChangeEvent, useEffect, useMemo } from 'react'
import { NounTraitLayer } from '@/utils/dto/NounTraitLayer'
import useNounTraitList from '@/utils/services/useNounTraitList'
import { debounce, startCase } from 'lodash'
import styles from '@/utils/styles/nounFilters.module.css'
import Project from '@/utils/dto/Project'

type Props = {
    project: Project
    layer: NounTraitLayer
    selected?: string
    updateSelected: (e: ChangeEvent<HTMLSelectElement>) => void
}

const SelectNounTrait: React.FC<Props> = ({
    project,
    layer,
    selected,
    updateSelected,
}) => {
    const { fetchNounTraitList, nounTraitList } = useNounTraitList(project)

    useEffect(() => {
        const debouncedFetch = debounce(() => {
            const params = new URLSearchParams()
            params.set('layer', layer)
            fetchNounTraitList(params)
        }, 500)

        debouncedFetch()

        return () => debouncedFetch.cancel()
    }, [layer])

    const filteredList = useMemo(() => {
        return nounTraitList
            ? nounTraitList
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
                  .sort((a, b) => a.label.localeCompare(b.label))
            : []
    }, [nounTraitList])

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

export default SelectNounTrait
