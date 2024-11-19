import Dreams from '@/app/nouns/dreams/_components/Dreams'
import ProjectProvider from '@/components/Provider/Project'
import NounTraits from '@/components/NounTraits'
import FilterDisplayProvider from '@/components/Provider/FilterDisplay'
import Filters from '@/app/nouns/dreams/_components/Filters'
import DimensionsProvider from '@/components/Provider/Dimensions'
import Header from '@/app/nouns/dreams/_components/Header'
import { unstable_cache } from 'next/cache'
import useApi from '@/utils/hooks/v2/useApi'
import { isDreamNounListResponse } from '@/utils/dto/DreamNoun'
import SearchParams from '@/utils/dto/SearchParams'

async function fetchFallbackData(searchParams: SearchParams) {
    const params = await searchParams

    const query = new URLSearchParams(params)

    const fetchFn = unstable_cache(
        async () => {
            const api = useApi()

            const { data } = await api.get(`/dream-nouns?${query.toString()}`)

            if (!isDreamNounListResponse(data)) throw new Error('Invalid data')

            return data
        },
        ['dream-nouns', query.toString()],
        { revalidate: 43200, tags: ['dream-nouns'] }
    )

    return fetchFn()
}

type Props = {
    searchParams: SearchParams
}

export default async function Page({ searchParams }: Props) {
    const fallbackData = await fetchFallbackData(searchParams)

    const project = 'Nouns'

    return (
        <ProjectProvider>
            <NounTraits project={project}>
                <FilterDisplayProvider>
                    <DimensionsProvider>
                        <div className="p-4 space-y-4">
                            <Header />

                            <main className="space-y-4">
                                <div className="pr-2 pb-[6px]">
                                    <Filters />
                                </div>

                                <Dreams fallbackData={fallbackData} />
                            </main>
                        </div>
                    </DimensionsProvider>
                </FilterDisplayProvider>
            </NounTraits>
        </ProjectProvider>
    )
}
