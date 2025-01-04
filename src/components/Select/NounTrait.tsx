'use client'

import { useMemo } from 'react'
import { NounTraitLayer } from '@/utils/dto/NounTraitLayer'
import Select from '@/components/Select/Select'
import SelectValue from '@/utils/dto/SelectValue'
import useNounTraitList from '@/utils/hooks/useNounTraitList'
import { startCase } from 'lodash'

type Props = {
    anchorTo?: 'bottom' | 'right'
    disabled?: boolean
    layer: NounTraitLayer
    required?: boolean
    selected: SelectValue
    setSelected: (value: number | string | undefined) => void
    valueKey?: 'name' | 'seed_id'
}

const SelectNounTrait: React.FC<Props> = ({
    anchorTo,
    disabled,
    layer,
    required,
    selected,
    setSelected,
    valueKey = 'name',
}) => {
    const { accessoryList, backgroundList, bodyList, glassesList, headList } =
        useNounTraitList()

    const traits = useMemo(() => {
        return {
            accessory: accessoryList,
            background: backgroundList,
            body: bodyList,
            glasses: glassesList,
            head: headList,
        }[layer]
    }, [accessoryList, backgroundList, bodyList, glassesList, headList, layer])

    const options = useMemo(() => {
        return traits.map((trait) => ({
            ...trait,
            imgSrc: trait.svg_url,
            label:
                trait.layer === 'background'
                    ? trait.name.toLowerCase() === 'd5d7e1'
                        ? 'cool'
                        : 'warm'
                    : startCase(
                          trait.name.replace(new RegExp(`^${trait.layer}-`), '')
                      ),
            value: trait[valueKey || 'name'],
        }))
    }, [traits, valueKey])

    return (
        <Select
            anchorTo={anchorTo}
            disabled={disabled}
            label={startCase(layer)}
            options={options}
            required={required}
            selected={selected}
            setSelected={(trait) => {
                setSelected(
                    typeof trait === 'string' || typeof trait === 'number'
                        ? trait
                        : undefined
                )
            }}
        />
    )
}

export default SelectNounTrait
