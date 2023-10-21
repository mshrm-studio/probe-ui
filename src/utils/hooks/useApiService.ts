import { useState } from 'react'
import ApiError from '@/utils/dto/ApiError'
import axios from 'axios'
import { isBoolean, isNumber, isObject, isString } from 'lodash'
import LilNounFilters from '@/utils/dto/LilNounFilters'
import { isRawLaravelApiError } from '@/utils/dto/RawLaravelApiError'

const useApiService = () => {
    const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
    })

    const parseFilters = (filters: LilNounFilters): URLSearchParams => {
        const params = new URLSearchParams()

        for (const [key, value] of Object.entries(filters)) {
            if (value !== undefined && value !== null) {
                if (isString(value) && value) {
                    params.append(key, value)
                } else if (isNumber(value) || isBoolean(value)) {
                    params.append(key, value.toString())
                }
            }
        }

        return params
    }

    const [processing, setProcessing] = useState<boolean>(false)

    const [error, setError] = useState<ApiError | null>(null)

    const internalError = {
        status: 500,
        data: {
            message: 'Internal Error. Please try again later.',
        },
    }

    const parseRawApiError = (err: unknown): ApiError => {
        if (isRawLaravelApiError(err)) {
            return {
                statusText: err.response?.statusText,
                status: err.response?.status ?? internalError.status,
                data: {
                    errors: isObject(err.response?.data?.errors)
                        ? err.response?.data?.errors
                        : undefined,
                    message:
                        err.response?.data?.message ??
                        internalError.data.message,
                },
            }
        } else {
            return internalError
        }
    }

    return {
        api,
        error,
        internalError,
        parseFilters,
        parseRawApiError,
        processing,
        setError,
        setProcessing,
    }
}

export default useApiService
