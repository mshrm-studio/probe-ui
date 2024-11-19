import { isObject } from 'lodash'
import {
    isModelResponse,
    isPaginatedModelListResponse,
    PaginatedModelListResponse,
} from '@/utils/dto/ApiResponse'

export default interface Noun {
    token_id: number
    token_uri: string
    background_name: string
    head_name: string
    glasses_name: string
    body_name: string
    accessory_name: string
    block_number: string
    minted_at: string
    area: number | null
    weight: number | null
    color_histogram: Record<string, number> | null
    svg_path: string | null
    svg_url: string | null
    png_path: string | null
    png_url: string | null
}

export interface NounResponse {
    data: Noun
}

export interface NounListResponse
    extends Omit<PaginatedModelListResponse, 'data'> {
    data: Noun[]
}

export const isNoun = (i: unknown): i is Noun => {
    return isObject(i) && 'token_id' in i
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
