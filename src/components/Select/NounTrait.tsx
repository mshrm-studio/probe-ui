'use client'

import React, { useEffect, useMemo } from 'react'
import { NounTraitLayer } from '@/utils/dto/NounTraitLayer'
import useNounTraitList from '@/utils/services/useNounTraitList'
import { debounce, startCase } from 'lodash'
import Project from '@/utils/dto/Project'
import Select from '@/components/Select/Select'

type Props = {
    disabled?: boolean
    project: Project
    layer: NounTraitLayer
    selected?: string | null
    updateSelected: (e: {
        target: { name: string; value?: string | null }
    }) => void
}

const SelectNounTrait: React.FC<Props> = ({
    disabled,
    project,
    layer,
    selected,
    updateSelected,
}) => {
    const { fetchNounTraitList, nounTraitList } = useNounTraitList(project)

    useEffect(() => {
        const debouncedFetch = debounce(() => {
            const params = new URLSearchParams()
            params.set('per_page', '300')
            params.set('layer', layer)
            fetchNounTraitList(params)
        }, 500)

        debouncedFetch()

        return () => debouncedFetch.cancel()
    }, [layer])

    function handleSelect(value?: number | string | null) {
        if (typeof value === 'string' || value === undefined) {
            updateSelected({ target: { name: layer, value } })
        }
    }

    const listWithImgSrc = useMemo(() => {
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

    const curatedList = useMemo(() => {
        if (layer !== 'background') return listWithImgSrc

        return listWithImgSrc.map((item) => ({
            ...item,
            label: item.label.toLowerCase() == 'd5d7e1' ? 'cool' : 'warm',
        }))
    }, [listWithImgSrc])

    return (
        <Select
            disabled={disabled}
            label={layer}
            options={curatedList}
            selected={selected}
            updateSelected={handleSelect}
        />
    )
}

export default SelectNounTrait
