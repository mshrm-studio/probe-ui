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

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: [
                {
                    url: `${process.env.NEXT_PUBLIC_DO_STORAGE_URL}/nouns/pngs/${id}.png`,
                },
            ],
        },
    }
}
