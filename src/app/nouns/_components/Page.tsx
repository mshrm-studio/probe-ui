import Nouns from '@/app/nouns/_components/Nouns'
import Project from '@/utils/dto/Project'
import { unstable_cache } from 'next/cache'
import useApi from '@/utils/hooks/v2/useApi'
import { isNounListResponse } from '@/utils/dto/Noun'
import SearchParams from '@/utils/dto/SearchParams'
import CatalogueHeader from '@/components/Header/Catalogue'
import useHref from '@/utils/hooks/useHref'

async function fetchFallbackData(project: Project, searchParams: SearchParams) {
    const params = await searchParams

    const query = new URLSearchParams(params)

    const fetchFn = unstable_cache(
        async () => {
            const api = useApi()

            const path = project === 'LilNouns' ? '/lil-nouns' : '/nouns'

            try {
                const { data } = await api.get(`${path}?${query.toString()}`)

                if (!isNounListResponse(data)) {
                    throw new Error(
                        `Invalid data format: ${JSON.stringify(data)}`
                    )
                }

                return data
            } catch (error: any) {
                throw new Error(error?.message || 'Internal Error')
            }
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

    const { lilsLink, nounsLink } = useHref()

    return (
        <div className="p-4 space-y-4">
            <CatalogueHeader
                breadcrumbs={[
                    { label: 'Probe', href: '/' },
                    {
                        label: project === 'LilNouns' ? 'Lils' : 'Nouns',
                        href: project === 'LilNouns' ? lilsLink : nounsLink,
                    },
                ]}
            />

            <main>
                <Nouns fallbackData={fallbackData} />
            </main>
        </div>
    )
}
