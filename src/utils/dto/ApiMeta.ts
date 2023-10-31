export default interface ApiMeta {
    current_page: number
    from: number
    last_page: number
    per_page: number
    to: number
    total: number
}

export function isApiMeta(input: unknown): input is ApiMeta {
    return input !== null && typeof input === 'object' && 'total' in input
}
