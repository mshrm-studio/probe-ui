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
    selected: string | undefined
    setSelected: (value: string | undefined) => void
}

const SearchSelectNounTrait: React.FC<Props> = ({
    disabled,
    layer,
    selected,
    setSelected,
}) => {
    const {
        accessoryListOptions,
        backgroundListOptions,
        bodyListOptions,
        glassesListOptions,
        headListOptions,
    } = useNounTraitList()

    const traitList = useMemo(() => {
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
            typeof selectedTrait === 'string' ? selectedTrait : undefined
        )
    }, [selectedTrait])

    return (
        <SearchSelect
            disabled={disabled}
            label={startCase(layer)}
            options={traitList}
            selected={selectedTrait}
            setSelected={setSelectedTrait}
        />
    )
}

export default SearchSelectNounTrait
