import { isObject } from 'lodash'

export default interface AuctionContractError {
    message: string
    code: string
    info: {
        error: {
            code: string
            message: string
        }
    }
}

export const isAuctionContractError = (
    input: unknown
): input is AuctionContractError => {
    return (
        isObject(input) &&
        input !== undefined &&
        'message' in input &&
        'code' in input &&
        'info' in input &&
        isObject(input.info) &&
        input.info !== undefined &&
        'error' in input.info &&
        isObject(input.info.error) &&
        input.info.error !== undefined &&
        'code' in input.info.error &&
        'message' in input.info.error
    )
}
