import useApiService from '@/utils/hooks/useApiService'
import { useState } from 'react'
import LilNoun, { isLilNounList } from '@/utils/dto/LilNoun'

const useLilNounList = () => {
    const {
        api,
        error,
        internalError,
        parseRawApiError,
        processing,
        setError,
        setProcessing,
    } = useApiService()

    const [list, setList] = useState<LilNoun[] | null>(null)

    const fetchLilNounList = (params?: URLSearchParams): Promise<LilNoun[]> => {
        return new Promise<LilNoun[]>((resolve, reject) => {
            setProcessing(true)
            setError(null)

            api.get(
                `/lil-nouns${
                    params && params.toString() ? `?${params.toString()}` : ''
                }`
            )
                .then((response) => {
                    if (isLilNounList(response?.data?.data)) {
                        setList(response.data.data)

                        resolve(response.data.data)
                    } else {
                        reject(internalError)
                    }
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

    return { error, fetching: processing, list, fetchLilNounList }
}

export default useLilNounList
