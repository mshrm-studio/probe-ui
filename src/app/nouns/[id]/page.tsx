import NounPage from '@/components/NounPage/NounPage'
import type { Metadata } from 'next'

type PageProps = {
    params: { id: number }
}

export default function Page({ params }: PageProps) {
    return <NounPage project="Nouns" nounId={params.id} />
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const id = params.id
    const title = `Noun ${id} | Probe`
    const description = `Date of birth, colors and stats of Noun ${id}.`
    const pageUrl = `https://probe.wtf/nouns/${id}`
    const images = [
        {
            url: `${process.env.NEXT_PUBLIC_DO_STORAGE_URL}/nouns/pngs/${id}.png`,
            width: 320,
            height: 320,
        },
    ]

    // <meta property="fc:frame" content="vNext" />
    // <meta property="fc:frame:image" content="https://media1.giphy.com/media/nk5GmpufiGkJb2eE9P/giphy.gif?cid=6c09b952ewk3mawwmgcpkri8fcyni0odostsle7eu4gr58lp&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=g" />
    // <meta property="fc:frame:image:aspect_ratio" content="1:1" />

    // <!-- Optional Properties for Interaction -->
    // <meta property="fc:frame:button:1" content="lilnouns.wtf" />
    // <meta property="fc:frame:button:1:action" content="link" />
    // <meta property="fc:frame:button:1:target" content="https://lilnouns.wtf" />

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
            'fc:frame:button:1': pageUrl,
            'fc:frame:button:1:action': 'link',
            'fc:frame:button:1:target': pageUrl,
        },
    }
}
