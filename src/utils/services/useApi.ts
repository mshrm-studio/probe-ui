import { useCallback, useMemo, useState } from 'react'
import ApiError from '@/utils/dto/ApiError'
import axios from 'axios'
import { isObject } from 'lodash'
import { isRawLaravelApiError } from '@/utils/dto/RawLaravelApiError'

const useApi = () => {
    const api = useMemo(
        () =>
            axios.create({
                baseURL: process.env.NEXT_PUBLIC_API_URL,
            }),
        []
    )

    const [processing, setProcessing] = useState(false)

    const [error, setError] = useState<ApiError | null>(null)

    const internalError = useMemo(
        () => ({
            status: 500,
            data: {
                message: 'Internal Error. Please try again later.',
            },
        }),
        []
    )

    const parseRawApiError = useCallback((err: unknown) => {
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
    }, [])

    return {
        api,
        error,
        internalError,
        parseRawApiError,
        processing,
        setError,
        setProcessing,
    }
}

export default useApi
