'use client'

import { useEffect, useMemo, useState } from 'react'
import { NounTraitLayer } from '@/utils/dto/NounTraitLayer'
import { startCase } from 'lodash'
import SearchSelect from '@/components/SearchSelect/SearchSelect'
import SearchSelectSelected from '@/utils/dto/SearchSelectSelected'
import useNounTraitList from '@/utils/hooks/useNounTraitList'

type Props = {
    disabled?: boolean
    layer: NounTraitLayer
    selected: number | string | undefined
    setSelected: (value: number | string | undefined) => void
    valueKey?: 'name' | 'seed_id'
}

const SearchSelectNounTrait: React.FC<Props> = ({
    disabled,
    layer,
    selected,
    setSelected,
    valueKey = 'name',
}) => {
    const {
        accessoryListOptions,
        backgroundListOptions,
        bodyListOptions,
        glassesListOptions,
        headListOptions,
    } = useNounTraitList(valueKey)

    const options = useMemo(() => {
        return {
            accessory: accessoryListOptions,
            background: backgroundListOptions,
            body: bodyListOptions,
            glasses: glassesListOptions,
            head: headListOptions,
        }[layer]
    }, [
        accessoryListOptions,
        backgroundListOptions,
        bodyListOptions,
        glassesListOptions,
        headListOptions,
        layer,
    ])

    const [selectedTrait, setSelectedTrait] =
        useState<SearchSelectSelected>(selected)

    useEffect(() => {
        setSelectedTrait(selected)
    }, [selected])

    useEffect(() => {
        setSelected(
            typeof selectedTrait === 'string' ||
                typeof selectedTrait === 'number'
                ? selectedTrait
                : undefined
        )
    }, [selectedTrait])

    return (
        <SearchSelect
            disabled={disabled}
            label={startCase(layer)}
            options={options}
            selected={selectedTrait}
            setSelected={setSelectedTrait}
        />
    )
}

export default SearchSelectNounTrait
