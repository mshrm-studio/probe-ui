import NounPage from '@/components/NounPage/NounPage'
import type { Metadata } from 'next'

type PageProps = {
    params: { id: number }
}

export default function Page({ params }: { params: { id: number } }) {
    return <NounPage project="LilNouns" nounId={params.id} />
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const id = params.id
    const title = `Lil Noun ${id} | Probe`
    const description = `Date of birth, colors and stats of Lil Noun ${id}.`
    const pageUrl = `https://probe.wtf/lils/${id}`
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
