import Header from '@/app/nouns/dreams/create/_components/Header'
import NounTraits from '@/components/NounTraits'
import Proposal from '@/app/nouns/proposals/create/_components/Proposal'

export default async function Page() {
    return (
        <NounTraits project="Nouns">
            <Header />

            <main>
                <Proposal />
            </main>
        </NounTraits>
    )
}
