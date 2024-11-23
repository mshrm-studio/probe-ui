import { isObject } from 'lodash'
import {
    isModelResponse,
    isPaginatedModelListResponse,
    PaginatedModelListResponse,
} from '@/utils/dto/ApiResponse'

export default interface Noun {
    area: number | null
    accessory_index: number
    accessory_name: string
    background_index: number
    background_name: string
    block_number: string
    body_index: number
    body_name: string
    color_histogram: Record<string, number> | null
    glasses_index: number
    glasses_name: string
    head_index: number
    head_name: string
    minted_at: string
    png_path: string | null
    png_url: string | null
    svg_path: string | null
    svg_url: string | null
    token_id: number
    token_uri?: string | null
    weight: number | null
}

export interface NounResponse {
    data: Noun
}

export interface NounListResponse
    extends Omit<PaginatedModelListResponse, 'data'> {
    data: Noun[]
}

export const isNoun = (i: unknown): i is Noun => {
    return isObject(i) && 'token_id' in i && 'accessory_index' in i
}

export const isNounList = (i: unknown): i is Noun[] => {
    return Array.isArray(i) && i.every((item) => isNoun(item))
}

export const isNounResponse = (i: unknown): i is NounResponse => {
    return isModelResponse(i) && isNoun(i.data)
}

export const isNounListResponse = (i: unknown): i is NounListResponse => {
    return isPaginatedModelListResponse(i) && isNounList(i.data)
}
