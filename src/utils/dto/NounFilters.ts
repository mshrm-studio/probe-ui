import SortFilters from '@/utils/dto/SortFilters'

export default interface NounFilters extends SortFilters {
    search?: string | null
    page?: number | null
    per_page?: number | null
    background?: string | null
    glasses?: string | null
    body?: string | null
    accessory?: string | null
    head?: string | null
    color?: string | null
}
