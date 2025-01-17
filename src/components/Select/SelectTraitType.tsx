'use client'

import Select from '@/components/Select/Select'
import {
    isNounTraitLayer,
    NounTraitLayer,
    nounTraitLayers,
} from '@/utils/dto/NounTraitLayer'
import SelectValue from '@/utils/dto/SelectValue'
import { startCase } from 'lodash'

type Props = {
    disabled?: boolean
    exclude?: NounTraitLayer[]
    required?: boolean
    selected: SelectValue
    setSelected: (value: NounTraitLayer | undefined) => void
}

const SelectTraitType: React.FC<Props> = ({
    disabled,
    exclude,
    required,
    selected,
    setSelected,
}) => {
    return (
        <Select
            disabled={disabled}
            label="Trait Type"
            options={nounTraitLayers
                .filter((layer) => !exclude?.includes(layer))
                .map((layer) => ({
                    label: startCase(layer),
                    value: layer,
                }))}
            required={required}
            selected={selected}
            setSelected={(trait) => {
                setSelected(isNounTraitLayer(trait) ? trait : undefined)
            }}
        />
    )
}

export default SelectTraitType
