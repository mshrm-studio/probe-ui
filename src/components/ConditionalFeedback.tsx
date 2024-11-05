import { isApiError } from '@/utils/dto/ApiError'
import FetchingImage from '@/components/FetchingImage'
import { useMemo } from 'react'
import StaticAlert from '@/components/StaticAlert'

type Props = {
    children: React.ReactNode
    error?: unknown
    fetching?: boolean
}

export default function ConditionalFeedback({
    children,
    error,
    fetching,
}: Props) {
    const apiError = useMemo(() => {
        return isApiError(error) ? error : null
    }, [error])

    const errorMessage = useMemo(() => {
        if (apiError) return apiError.data.message

        if (
            typeof error === 'object' &&
            error &&
            'message' in error &&
            typeof error.message === 'string'
        )
            return error.message

        return 'Unknown Error'
    }, [apiError, error])

    if (error) return <StaticAlert>{errorMessage}</StaticAlert>

    if (fetching) return <FetchingImage />

    return <div>{children}</div>
}
