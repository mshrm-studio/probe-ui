import NounPage from '@/app/nouns/[id]/_components/NounPage'
import type { Metadata } from 'next'
import NounMintProvider from '@/components/Provider/NounMint'
import NounSettlementProvider from '@/components/Provider/NounSettlement'
import useApi from '@/utils/hooks/v2/useApi'
import { isNoun } from '@/utils/dto/Noun'
import StaticAlert from '@/components/StaticAlert'

type PageProps = {
    params: { id: string }
}

export default async function Page({ params }: PageProps) {
    const api = useApi()

    const { data } = await api
        .get(`/nouns/${params.id}`)
        .then((res) => res.data)

    if (!isNoun(data)) return <StaticAlert>Unknown Error</StaticAlert>

    return (
        <NounSettlementProvider nounId={Number(params.id)}>
            <NounMintProvider nounId={Number(params.id)}>
                <NounPage project="Nouns" noun={data} />
            </NounMintProvider>
        </NounSettlementProvider>
    )
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const id = params.id
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
        keywords: ['Nouns', 'Lil Nouns'],
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
