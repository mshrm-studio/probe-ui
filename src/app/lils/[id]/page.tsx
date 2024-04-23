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

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: [
                {
                    url: `${process.env.NEXT_PUBLIC_DO_STORAGE_URL}/lils/pngs/${id}.png`,
                },
            ],
        },
    }
}
