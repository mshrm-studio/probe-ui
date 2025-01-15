import { isObject } from 'lodash'
import NounTrait from '@/utils/dto/NounTrait'
import {
    isModelResponse,
    isPaginatedModelListResponse,
    PaginatedModelListResponse,
} from '@/utils/dto/ApiResponse'
import { isNounTraitLayer, NounTraitLayer } from '@/utils/dto/NounTraitLayer'

export default interface DreamNoun {
    id: number
    accessory_seed_id: number | null
    accessory?: NounTrait | null
    background_seed_id: number | null
    background?: NounTrait | null
    body_seed_id: number | null
    body?: NounTrait | null
    created_at: string
    custom_trait_image: string | null
    custom_trait_image_url?: string | null
    custom_trait_layer: Exclude<NounTraitLayer, 'background'> | null
    dreamer: string
    glasses_seed_id: number | null
    glasses?: NounTrait | null
    head_seed_id: number | null
    head?: NounTrait | null
}

export type DreamNounWithCustomTrait = Omit<
    DreamNoun,
    'custom_trait_layer' | 'custom_trait_image'
> & {
    custom_trait_layer: Exclude<NounTraitLayer, 'background'>
    custom_trait_image: string
    custom_trait_image_url: string
}

export interface DreamNounResponse {
    data: DreamNoun
}

export interface DreamNounListResponse
    extends Omit<PaginatedModelListResponse, 'data'> {
    data: DreamNoun[]
}

export const isDreamNoun = (i: unknown): i is DreamNoun => {
    return isObject(i) && 'dreamer' in i
}

export const isDreamNounWithCustomTrait = (
    i: unknown
): i is DreamNounWithCustomTrait => {
    return (
        isDreamNoun(i) &&
        isNounTraitLayer(i.custom_trait_layer) &&
        typeof i.custom_trait_image === 'string' &&
        typeof i.custom_trait_image_url === 'string'
    )
}

export const isDreamNounList = (i: unknown): i is DreamNoun[] => {
    return Array.isArray(i) && i.every((item) => isDreamNoun(item))
}

export const isDreamNounResponse = (i: unknown): i is DreamNounResponse => {
    return isModelResponse(i) && isDreamNoun(i.data)
}

export const isDreamNounListResponse = (
    i: unknown
): i is DreamNounListResponse => {
    return isPaginatedModelListResponse(i) && isDreamNounList(i.data)
}
