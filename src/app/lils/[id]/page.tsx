import NounPage from '@/app/nouns/[id]/_components/NounPage'
import type { Metadata } from 'next'
import NounMintProvider from '@/components/Provider/NounMint'
import { isNoun } from '@/utils/dto/Noun'
import StaticAlert from '@/components/StaticAlert'
import useApi from '@/utils/hooks/v2/useApi'

type PageProps = {
    params: { id: string }
}

export default async function Page({ params }: PageProps) {
    const api = useApi()

    const { data } = await api
        .get(`/lil-nouns/${params.id}`)
        .then((res) => res.data)

    if (!isNoun(data)) return <StaticAlert>Unknown Error</StaticAlert>

    return (
        <NounMintProvider nounId={Number(params.id)}>
            <NounPage project="LilNouns" noun={data} />
        </NounMintProvider>
    )
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const id = params.id
    const title = `Lil Noun ${id}`
    const description = `Probe the colors and stats for Lil Noun ${id}.`
    const pageUrl = `https://www.probe.wtf/lils/${id}`
    const images = [
        {
            url: `${process.env.NEXT_PUBLIC_DO_STORAGE_URL}/lils/pngs/${id}.png`,
            width: 320,
            height: 320,
        },
    ]

    return {
        title: title,
        description: description,
        keywords: ['Nouns', 'Lil Nouns'],
        openGraph: {
            title: title,
            description: description,
            url: pageUrl,
            siteName: 'probe.wtf',
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
            'fc:frame:button:1': `probe.wtf/lils/${id}`,
            'fc:frame:button:1:action': 'link',
            'fc:frame:button:1:target': pageUrl,
        },
    }
}
