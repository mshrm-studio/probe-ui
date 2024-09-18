import NounPage from '@/components/NounPage/NounPage'
import type { Metadata } from 'next'
import NounSettlementProvider from '@/components/Provider/NounSettlement'
import NounMintProvider from '@/components/Provider/NounMint'

type PageProps = {
    params: { id: string }
}

export default function Page({ params }: PageProps) {
    return (
        <NounSettlementProvider nounId={Number(params.id)}>
            <NounMintProvider nounId={Number(params.id)}>
                <NounPage project="LilNouns" nounId={Number(params.id)} />
            </NounMintProvider>
        </NounSettlementProvider>
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
