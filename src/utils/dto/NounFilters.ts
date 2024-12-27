import SortFilters from '@/utils/dto/SortFilters'

export default interface NounFilters extends SortFilters {
    accessory?: string
    background?: string
    body?: string
    color?: string
    glasses?: string
    head?: string
    page?: number
    per_page?: number
    search?: string
    settler?: string
}
