import useApi from '@/utils/services/useApi'
import { useState } from 'react'

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
        response,
    }
}

export default useFetcher
