import NounPage from '@/app/nouns/[id]/_components/NounPage'
import type { Metadata } from 'next'
import NounMintProvider from '@/components/Provider/NounMint'
import NounSettlementProvider from '@/components/Provider/NounSettlement'
import useApi from '@/utils/hooks/v2/useApi'
import { isNounResponse } from '@/utils/dto/Noun'
import { unstable_cache } from 'next/cache'

type Params = Promise<{ id: string }>

async function fetchFallbackData(id: string) {
    const fetchFn = unstable_cache(
        async () => {
            const api = useApi()

            const { data } = await api.get(`/nouns/${id}`)

            if (!isNounResponse(data)) throw new Error('Invalid data')

            return data
        },
        [`nouns-${id}`],
        { revalidate: 43200, tags: [`nouns-${id}`] }
    )

    return fetchFn()
}

type PageProps = {
    params: Params
}

export default async function Page(props: PageProps) {
    const { id } = await props.params

    const data = await fetchFallbackData(id)

    return (
        <NounSettlementProvider nounId={Number(id)}>
            <NounMintProvider nounId={Number(id)}>
                <NounPage project="Nouns" noun={data.data} />
            </NounMintProvider>
        </NounSettlementProvider>
    )
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const { id } = await props.params
    const title = `Noun ${id}`
    const description = `Probe the colors and stats for Noun ${id}.`
    const pageUrl = `https://probe.wtf/nouns/${id}`
    const images = [
        {
            url: `${process.env.NEXT_PUBLIC_DO_STORAGE_URL}/nouns/pngs/${id}.png`,
            width: 320,
            height: 320,
        },
    ]

    return {
        title: title,
        description: description,
        keywords: ['Nouns'],
        openGraph: {
            url: pageUrl,
            siteName: 'probe.wtf',
            title: title,
            description: description,
            images: images,
            type: 'website',
        },
        twitter: {
            card: 'summary',
            title: title,
            description: description,
            images: images,
        },
        other: {
            'fc:frame': 'vNext',
            'fc:frame:image': images[0].url,
            'fc:frame:image:aspect_ratio': '1:1',
            'fc:frame:button:1': `probe.wtf/nouns/${id}`,
            'fc:frame:button:1:action': 'link',
            'fc:frame:button:1:target': pageUrl,
        },
    }
}
