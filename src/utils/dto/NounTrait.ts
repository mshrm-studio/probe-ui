import { isObject } from 'lodash'
import { NounTraitLayer } from '@/utils/dto/NounTraitLayer'

export default interface NounTrait {
    name: string
    layer: NounTraitLayer
    seed_id: number
}

export const isNounTrait = (input: unknown): input is NounTrait => {
    return (
        isObject(input) &&
        'name' in input &&
        'layer' in input &&
        'seed_id' in input
    )
}

export const isNounTraitList = (input: unknown): input is NounTrait[] => {
    return Array.isArray(input) && input.every((item) => isNounTrait(item))
}
