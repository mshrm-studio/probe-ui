'use client'

import React, { useEffect, useMemo } from 'react'
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
    selected: string | null | undefined
    setSelected: React.Dispatch<
        React.SetStateAction<string | number | null | undefined>
    >
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
            console.log('fetching noun trait list')
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

    return (
        <SearchSelect
            disabled={disabled}
            label={startCase(layer)}
            options={curatedList}
            selected={selected}
            setSelected={setSelected}
        />
    )
}

export default SearchSelectNounTrait
