import { isBoolean, isNumber, isString } from 'lodash'
import NounFilters from '@/utils/dto/NounFilters'

const useFilters = () => {
    const parseFilters = (filters: NounFilters): URLSearchParams => {
        const params = new URLSearchParams()

        for (const [key, value] of Object.entries(filters)) {
            if (value !== undefined && value !== null && value !== '') {
                if (isString(value) && value) {
                    params.append(key, value)
                } else if (isNumber(value) || isBoolean(value)) {
                    params.append(key, value.toString())
                }
            }
        }

        return params
    }

    return {
        parseFilters,
    }
}

export default useFilters
