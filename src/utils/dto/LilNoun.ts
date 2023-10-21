import { isObject } from 'lodash'

export default interface LilNoun {
    token_id: number
    token_uri: string
    background_name: string
    glasses_name: string
    body_name: string
    accessory_name: string
}

export const isLilNoun = (input: unknown): input is LilNoun => {
    return isObject(input) && 'token_id' in input
}

export const isLilNounList = (input: unknown): input is LilNoun[] => {
    return Array.isArray(input) && input.every((item) => isLilNoun(item))
}
