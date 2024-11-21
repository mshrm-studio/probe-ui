import NounPage from '@/app/nouns/[id]/_components/NounPage'
import type { Metadata } from 'next'
import useApi from '@/utils/hooks/v2/useApi'
import { unstable_cache } from 'next/cache'
import { isDreamNounResponse } from '@/utils/dto/DreamNoun'

type Params = Promise<{ id: string }>

async function fetchFallbackData(id: string) {
    const fetchFn = unstable_cache(
        async () => {
            const api = useApi()

            const { data } = await api.get(`/dream-nouns/${id}`)

            if (!isDreamNounResponse(data)) throw new Error('Invalid data')

            return data
        },
        [`dream-nouns-${id}`],
        { revalidate: 43200, tags: [`dream-nouns-${id}`] }
    )

    return fetchFn()
}

type PageProps = {
    params: Params
}

export default async function Page(props: PageProps) {
    const { id } = await props.params

    const data = await fetchFallbackData(id)

    return <NounPage project="Nouns" noun={data.data} />
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const { id } = await props.params
    const title = `Dream Noun ${id}`
    const description = `Probe the colors and stats for Noun ${id}.`
    const pageUrl = `https://probe.wtf/nouns/dreams/${id}`

    // const images = [
    //     {
    //         url: `${process.env.NEXT_PUBLIC_DO_STORAGE_URL}/nouns/pngs/${id}.png`,
    //         width: 320,
    //         height: 320,
    //     },
    // ]

    return {
        title: title,
        description: description,
        keywords: ['Dream Nouns'],
        openGraph: {
            url: pageUrl,
            siteName: 'probe.wtf',
            title: title,
            description: description,
            // images: images,
            type: 'website',
        },
        twitter: {
            card: 'summary',
            title: title,
            description: description,
            // images: images,
        },
        other: {
            'fc:frame': 'vNext',
            // 'fc:frame:image': images[0].url,
            'fc:frame:image:aspect_ratio': '1:1',
            'fc:frame:button:1': `probe.wtf/nouns/dreams/${id}`,
            'fc:frame:button:1:action': 'link',
            'fc:frame:button:1:target': pageUrl,
        },
    }
}
