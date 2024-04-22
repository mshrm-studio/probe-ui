import { isObject } from 'lodash'

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

export const isNoun = (input: unknown): input is Noun => {
    return isObject(input) && 'token_id' in input
}

export const isNounList = (input: unknown): input is Noun[] => {
    return Array.isArray(input) && input.every((item) => isNoun(item))
}
