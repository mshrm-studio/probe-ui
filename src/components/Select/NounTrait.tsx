'use client'

import { useEffect, useMemo, useState } from 'react'
import { NounTraitLayer } from '@/utils/dto/NounTraitLayer'
import Select from '@/components/Select/Select'
import SelectValue from '@/utils/dto/SelectValue'
import useNounTraitList from '@/utils/hooks/useNounTraitList'
import { startCase } from 'lodash'

type Props = {
    disabled?: boolean
    layer: NounTraitLayer
    search?: boolean
    selected: SelectValue
    setSelected: (value: number | string | undefined) => void
    valueKey?: 'name' | 'seed_id'
}

const SelectNounTrait: React.FC<Props> = ({
    disabled,
    layer,
    search,
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

    const [selectedTrait, setSelectedTrait] = useState<SelectValue>(selected)

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
        <Select
            disabled={disabled}
            label={startCase(layer)}
            options={options}
            search={search}
            selected={selectedTrait}
            setSelected={setSelectedTrait}
        />
    )
}

export default SelectNounTrait
