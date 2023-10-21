import { isNumber, isObject, isString } from 'lodash'

export default interface RawLaravelApiError {
    response?: {
        statusText?: string
        status?: number
        data?: {
            errors?: Record<string, string[]>
            message?: string
        }
    }
}

export const isRawLaravelApiError = (
    input: unknown
): input is RawLaravelApiError => {
    return (
        isObject(input) &&
        'response' in input &&
        isObject(input.response) &&
        'status' in input.response &&
        isNumber(input.response.status) &&
        'data' in input.response &&
        isObject(input.response.data) &&
        'message' in input.response.data &&
        isString(input.response.data.message)
    )
}
