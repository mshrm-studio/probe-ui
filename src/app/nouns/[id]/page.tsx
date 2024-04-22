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

    return {
        title: title,
        openGraph: {
            title: title,
        },
    }
}
