import useApiService from '@/utils/hooks/useApiService'
import { useState } from 'react'
import LilNounTrait, { isLilNounTraitList } from '@/utils/dto/LilNounTrait'

const useLilNounTraitList = () => {
    const {
        api,
        error,
        internalError,
        parseRawApiError,
        processing,
        setError,
        setProcessing,
    } = useApiService()

    const [list, setList] = useState<LilNounTrait[] | null>(null)

    const fetchLilNounTraitList = (
        params?: URLSearchParams
    ): Promise<LilNounTrait[]> => {
        return new Promise<LilNounTrait[]>((resolve, reject) => {
            setProcessing(true)
            setError(null)

            api.get(
                `/traits${
                    params && params.toString() ? `?${params.toString()}` : ''
                }`
            )
                .then((response) => {
                    if (isLilNounTraitList(response?.data)) {
                        setList(response.data)

                        resolve(response.data)
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

    return { error, fetching: processing, list, fetchLilNounTraitList }
}

export default useLilNounTraitList
