import { isObject } from 'lodash'

export default interface AuctionContractError {
    action?: string
    message?: string
    code?: string
    info?: {
        error?: {
            code?: string
            message?: string
        }
    }
    receipt?: {
        hash?: string
    }
    transaction?: {
        from?: string
        to?: string
    }
}
