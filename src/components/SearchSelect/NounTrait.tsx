'use client'

import { useContext, useEffect, useMemo, useState } from 'react'
import { NounTraitLayer } from '@/utils/dto/NounTraitLayer'
import { startCase } from 'lodash'
import SearchSelect from '@/components/SearchSelect/SearchSelect'
import SearchSelectSelected from '@/utils/dto/SearchSelectSelected'
import NounTraitsContext from '@/utils/contexts/NounTraitsContext'

type Props = {
    disabled?: boolean
    layer: NounTraitLayer
    selected: string | undefined
    setSelected: (value: string | undefined) => void
}

const SearchSelectNounTrait: React.FC<Props> = ({
    disabled,
    layer,
    selected,
    setSelected,
}) => {
    const { accessoryList, backgroundList, bodyList, glassesList, headList } =
        useContext(NounTraitsContext)

    const traitList = useMemo(() => {
        return {
            accessory: accessoryList,
            background: backgroundList,
            body: bodyList,
            glasses: glassesList,
            head: headList,
        }[layer]
    }, [accessoryList, backgroundList, bodyList, glassesList, headList, layer])

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

    const [selectedTrait, setSelectedTrait] =
        useState<SearchSelectSelected>(selected)

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
