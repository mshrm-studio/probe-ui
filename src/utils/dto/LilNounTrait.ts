import { isObject } from 'lodash'
import { LilNounTraitLayer } from '@/utils/dto/LilNounTraitLayer'

export default interface LilNounTrait {
    name: string
    layer: LilNounTraitLayer
    seed_id: number
}

export const isLilNounTrait = (input: unknown): input is LilNounTrait => {
    return (
        isObject(input) &&
        'name' in input &&
        'layer' in input &&
        'seed_id' in input
    )
}

export const isLilNounTraitList = (input: unknown): input is LilNounTrait[] => {
    return Array.isArray(input) && input.every((item) => isLilNounTrait(item))
}
