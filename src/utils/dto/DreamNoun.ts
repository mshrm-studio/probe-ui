import { isObject } from 'lodash'
import NounTrait from '@/utils/dto/NounTrait'
import {
    isModelResponse,
    isPaginatedModelListResponse,
    PaginatedModelListResponse,
} from '@/utils/dto/ApiResponse'

export default interface DreamNoun {
    id: number
    accessory_seed_id: number | null
    accessory?: NounTrait | null
    background_seed_id: number | null
    background?: NounTrait | null
    body_seed_id: number | null
    body?: NounTrait | null
    created_at: string
    dreamer: string
    glasses_seed_id: number | null
    glasses?: NounTrait | null
    head_seed_id: number | null
    head?: NounTrait | null
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
