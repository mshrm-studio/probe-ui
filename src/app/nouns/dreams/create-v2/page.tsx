import Dream from '@/app/nouns/dreams/create/_components/DreamV2'
import NounTraits from '@/components/NounTraits'
import Header from '@/app/nouns/dreams/create/_components/Header'

export default async function Page() {
    return (
        <NounTraits project="Nouns">
            <Header />

            <main>
                <Dream />
            </main>
        </NounTraits>
    )
}
