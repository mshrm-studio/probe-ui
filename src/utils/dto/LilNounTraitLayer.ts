import { isString } from 'lodash'

const LilNounTraitLayers = [
    'background',
    'head',
    'body',
    'accessory',
    'glasses',
] as const

export type LilNounTraitLayer = (typeof LilNounTraitLayers)[number]

export const lilNounTraitLayers = [...LilNounTraitLayers]

export const isLilNounTraitLayer = (
    input: unknown
): input is LilNounTraitLayer => {
    return (
        isString(input) && ([...LilNounTraitLayers] as string[]).includes(input)
    )
}
