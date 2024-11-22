import Dreams from '@/app/nouns/dreams/_components/Dreams'
import ProjectProvider from '@/components/Provider/Project'
import NounTraits from '@/components/NounTraits'
import FilterDisplayProvider from '@/components/Provider/FilterDisplay'
import CatalogueHeader from '@/components/Header/Catalogue'
import { unstable_cache } from 'next/cache'
import useApi from '@/utils/hooks/v2/useApi'
import { isDreamNounListResponse } from '@/utils/dto/DreamNoun'
import SearchParams from '@/utils/dto/SearchParams'
import useHref from '@/utils/hooks/useHref'
import Button from '@/components/Button'
import Link from 'next/link'

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

    const { nounsLink } = useHref()

    return (
        <ProjectProvider>
            <NounTraits project={project}>
                <FilterDisplayProvider>
                    <div className="p-4 space-y-4">
                        <CatalogueHeader
                            breadcrumbs={[
                                { label: 'Probe', href: '/' },
                                { label: 'Nouns', href: nounsLink },
                                { label: 'Dreams', href: '/nouns/dreams' },
                            ]}
                        />

                        <main className="space-y-4">
                            <Dreams fallbackData={fallbackData} />

                            <div className="fixed bottom-0 right-0 pr-4 pb-4 sm:pr-10">
                                <Link href="/nouns/dreams/create">
                                    <span className="sr-only">
                                        Create Dream
                                    </span>

                                    <Button nativeType="button">Dream</Button>
                                </Link>
                            </div>
                        </main>
                    </div>
                </FilterDisplayProvider>
            </NounTraits>
        </ProjectProvider>
    )
}
