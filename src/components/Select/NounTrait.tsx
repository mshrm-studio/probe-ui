'use client'

import React, { useEffect, useMemo } from 'react'
import { NounTraitLayer } from '@/utils/dto/NounTraitLayer'
import useNounTraitList from '@/utils/services/useNounTraitList'
import { debounce, startCase } from 'lodash'
import Project from '@/utils/dto/Project'
import Select from '@/components/Select/Select'

type Props = {
    project: Project
    layer: NounTraitLayer
    selected?: string
    updateSelected: (e: { target: { name: string; value: string } }) => void
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
            params.set('per_page', '200')
            params.set('layer', layer)
            fetchNounTraitList(params)
        }, 500)

        debouncedFetch()

        return () => debouncedFetch.cancel()
    }, [layer])

    function handleSelect(value?: number | string | null) {
        if (typeof value === 'string') {
            updateSelected({ target: { name: layer, value } })
        }
    }

    const filteredList = useMemo(() => {
        return nounTraitList
            ? nounTraitList
                  .map((item) => ({
                      imgSrc: item.svg_url,
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
                  .reduce(
                      (unique, item) => {
                          return unique.some(
                              (uItem) => uItem.value === item.value
                          )
                              ? unique
                              : [...unique, item]
                      },
                      [] as { imgSrc: string; label: string; value: string }[]
                  )
                  .sort((a, b) => a.label.localeCompare(b.label))
            : []
    }, [nounTraitList])

    return (
        <Select
            label={layer}
            options={filteredList}
            selected={selected}
            updateSelected={handleSelect}
        />
    )
}

export default SelectNounTrait
