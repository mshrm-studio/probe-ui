import { isObject } from 'lodash'

export interface SelectOptionStringValue {
    label: string
    value: string
    imgSrc?: string | null
}

export interface SelectOptionNumberValue {
    label: string
    value: number
    imgSrc?: string | null
}

type SelectOption = SelectOptionStringValue | SelectOptionNumberValue

export default SelectOption

export const isSelectOption = (input: unknown): input is SelectOption => {
    return isObject(input) && 'label' in input && 'value' in input
}

export const isSelectOptionList = (input: unknown): input is SelectOption[] => {
    return Array.isArray(input) && input.every((item) => isSelectOption(item))
}
