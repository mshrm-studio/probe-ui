import Header from '@/app/nouns-new/_components/Header/Header'
import Project from '@/utils/dto/Project'
import Controls from '@/app/nouns-new/_components/Controls'
import { unstable_cache } from 'next/cache'
import useApi from '@/utils/hooks/v2/useApi'
import { isNounListResponse } from '@/utils/dto/Noun'
import SearchParams from '@/utils/dto/SearchParams'
import Nouns from '@/app/nouns-new/_components/Nouns'

async function fetchFallbackData(project: Project, searchParams: SearchParams) {
    const params = await searchParams

    const query = new URLSearchParams(params)

    const fetchFn = unstable_cache(
        async () => {
            const api = useApi()

            const path = project === 'LilNouns' ? '/lil-nouns' : '/nouns'

            const { data } = await api.get(`${path}?${query.toString()}`)

            if (!isNounListResponse(data)) throw new Error('Invalid data')

            return data
        },
        [project, query.toString()],
        { revalidate: 43200, tags: [project] }
    )

    return fetchFn()
}

type Props = {
    project: Project
    searchParams: SearchParams
}

export default async function NounsPage({ project, searchParams }: Props) {
    const fallbackData = await fetchFallbackData(project, searchParams)

    return (
        <div className="p-4 space-y-4">
            <Header />

            <main className="space-y-4">
                <Controls />

                <Nouns fallbackData={fallbackData} />
            </main>
        </div>
    )
}
