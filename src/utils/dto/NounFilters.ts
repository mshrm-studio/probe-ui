import SortFilters from '@/utils/dto/SortFilters'

export default interface NounFilters extends SortFilters {
    search?: string
    page?: number
    per_page?: number
    background?: string
    glasses?: string
    body?: string
    accessory?: string
    head?: string
    color?: string
}
