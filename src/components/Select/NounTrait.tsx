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
    selected: SelectValue
    setSelected: (value: number | string | undefined) => void
    valueKey?: 'name' | 'seed_id'
}

const SelectNounTrait: React.FC<Props> = ({
    disabled,
    layer,
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

    const [selectedTrait, setSelectedTrait] = useState<SelectValue>(selected)

    useEffect(() => {
        console.log('*****')
        console.log('SelectNounTrait.tsx useEffect[selected]')

        if (selected !== selectedTrait) {
            console.log(`SelectNounTrait.tsx setSelectedTrait(${selected})`)
            setSelectedTrait(selected)
        }
    }, [selected])

    useEffect(() => {
        console.log('*****')
        console.log('SelectNounTrait.tsx useEffect[selectedTrait]')

        if (selected !== selectedTrait) {
            console.log(
                `SelectNounTrait.tsx setSelected(${
                    typeof selectedTrait === 'string' ||
                    typeof selectedTrait === 'number'
                        ? selectedTrait
                        : undefined
                })`
            )

            setSelected(
                typeof selectedTrait === 'string' ||
                    typeof selectedTrait === 'number'
                    ? selectedTrait
                    : undefined
            )
        }
    }, [selectedTrait])

    return (
        <Select
            disabled={disabled}
            label={startCase(layer)}
            options={options}
            selected={selectedTrait}
            setSelected={setSelectedTrait}
        />
    )
}

export default SelectNounTrait
