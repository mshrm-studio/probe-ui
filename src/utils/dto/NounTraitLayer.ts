import { isString } from 'lodash'

const NounTraitLayers = [
    'head',
    'glasses',
    'accessory',
    'body',
    'background',
] as const

export type NounTraitLayer = (typeof NounTraitLayers)[number]

export const nounTraitLayers = [...NounTraitLayers]

export const isNounTraitLayer = (input: unknown): input is NounTraitLayer => {
    return isString(input) && ([...NounTraitLayers] as string[]).includes(input)
}
