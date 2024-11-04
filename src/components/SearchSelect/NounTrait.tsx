'use client'

import React, { use, useEffect, useMemo, useState } from 'react'
import { NounTraitLayer } from '@/utils/dto/NounTraitLayer'
import useNounTraitList from '@/utils/services/useNounTraitList'
import { debounce, startCase } from 'lodash'
import Project from '@/utils/dto/Project'
import NounTrait, { isNounTraitList } from '@/utils/dto/NounTrait'
import SearchSelect from '@/components/SearchSelect/SearchSelect'

type Props = {
    disabled?: boolean
    project: Project
    layer: NounTraitLayer
    options?: NounTrait[] | null
    selected: string | undefined
    setSelected: (value: string | undefined) => void
}

const SearchSelectNounTrait: React.FC<Props> = ({
    disabled,
    project,
    layer,
    options,
    selected,
    setSelected,
}) => {
    const { fetchNounTraitList, nounTraitList } = useNounTraitList(project)

    useEffect(() => {
        const debouncedFetch = debounce(() => {
            const params = new URLSearchParams()
            params.set('per_page', '300')
            params.set('layer', layer)
            fetchNounTraitList(params)
        }, 500)

        if (!isNounTraitList(options)) {
            debouncedFetch()
        }

        return () => debouncedFetch.cancel()
    }, [layer])

    const traitList = useMemo(() => {
        return isNounTraitList(options)
            ? options
            : isNounTraitList(nounTraitList)
            ? nounTraitList
            : []
    }, [options, nounTraitList])

    const listWithImgSrc = useMemo(() => {
        return traitList
            .map((item) => ({
                imgSrc: item.svg_url,
                label:
                    item.layer === 'background'
                        ? item.name.replace(new RegExp(`^${layer}-`), '')
                        : startCase(
                              item.name.replace(new RegExp(`^${layer}-`), '')
                          ),
                value: item.name,
            }))
            .reduce(
                (unique, item) => {
                    return unique.some((uItem) => uItem.value === item.value)
                        ? unique
                        : [...unique, item]
                },
                [] as { imgSrc: string; label: string; value: string }[]
            )
            .sort((a, b) => a.label.localeCompare(b.label))
    }, [traitList])

    const curatedList = useMemo(() => {
        if (layer !== 'background') return listWithImgSrc

        return listWithImgSrc.map((item) => ({
            ...item,
            label: item.label.toLowerCase() == 'd5d7e1' ? 'cool' : 'warm',
        }))
    }, [listWithImgSrc])

    const [selectedTrait, setSelectedTrait] = useState<
        string | number | null | undefined
    >(selected)

    useEffect(() => {
        setSelectedTrait(selected)
    }, [selected])

    useEffect(() => {
        setSelected(
            typeof selectedTrait === 'string' ? selectedTrait : undefined
        )
    }, [selectedTrait])

    return (
        <SearchSelect
            disabled={disabled}
            label={startCase(layer)}
            options={curatedList}
            selected={selectedTrait}
            setSelected={setSelectedTrait}
        />
    )
}

export default SearchSelectNounTrait
