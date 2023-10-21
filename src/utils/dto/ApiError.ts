import { isNumber, isObject, isString } from 'lodash'

export default interface ApiError {
    statusText?: string
    status: number
    data: {
        errors?: Record<string, string[]>
        message: string
    }
}

export const isApiError = (input: unknown): input is ApiError => {
    return (
        isObject(input) &&
        'status' in input &&
        isNumber(input.status) &&
        'data' in input &&
        isObject(input.data) &&
        'message' in input.data &&
        isString(input.data.message)
    )
}
