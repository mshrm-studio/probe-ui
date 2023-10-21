'use client'
import React, { ChangeEvent, useEffect, useMemo } from 'react'
import { LilNounTraitLayer } from '@/utils/dto/LilNounTraitLayer'
import useLilNounTraitList from '@/utils/hooks/useLilNounTraitList'
import { debounce } from 'lodash'

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
    const { error, fetching, list, fetchLilNounTraitList } =
        useLilNounTraitList()

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
        return Array.isArray(list)
            ? list.map((item) => ({
                  label: item.name.replace(new RegExp(`^${layer}-`), ''),
                  value: item.name,
              }))
            : []
    }, [list])

    return (
        <select
            name={layer}
            id={layer}
            value={selected}
            onChange={updateSelected}
        >
            <option value="">Any {layer}</option>

            {filteredList.map((item) => (
                <option key={item.value} value={item.value}>
                    {item.label}
                </option>
            ))}
        </select>
    )
}

export default SelectLilNounTrait
