import { isObject } from 'lodash'

type SelectOption = {
    label: string
    value: string | number
    imgSrc?: string | null
    colorHex?: string | null
}

export default SelectOption

export const isSelectOption = (input: unknown): input is SelectOption => {
    return isObject(input) && 'label' in input && 'value' in input
}

export const isSelectOptionList = (input: unknown): input is SelectOption[] => {
    return Array.isArray(input) && input.every((item) => isSelectOption(item))
}
