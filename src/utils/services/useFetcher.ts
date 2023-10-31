import useApi from '@/utils/services/useApi'
import { useState } from 'react'
import ApiMeta, { isApiMeta } from '@/utils/dto/ApiMeta'

const useFetcher = () => {
    const {
        api,
        error,
        parseRawApiError,
        processing,
        setError,
        setProcessing,
    } = useApi()

    const [response, setResponse] = useState<any>()
    const [meta, setMeta] = useState<ApiMeta>()

    const fetchData = (
        path: string,
        params?: URLSearchParams
    ): Promise<any> => {
        return new Promise<any>((resolve, reject) => {
            setProcessing(true)
            setError(null)

            const query = params ? `?${params.toString()}` : ''

            const fullPath = path.startsWith('/')
                ? `${path}${query}`
                : `/${path}${query}`

            api.get(fullPath)
                .then((response) => {
                    if (
                        'data' in response &&
                        'meta' in response.data &&
                        isApiMeta(response.data.meta)
                    ) {
                        setMeta(response.data.meta)
                    }

                    setResponse(response)
                    resolve(response)
                })
                .catch((err) => {
                    setError(parseRawApiError(err))
                    reject(parseRawApiError(err))
                })
                .finally(() => {
                    setProcessing(false)
                })
        })
    }

    return {
        error,
        fetchData,
        fetching: processing,
        meta,
        response,
    }
}

export default useFetcher
