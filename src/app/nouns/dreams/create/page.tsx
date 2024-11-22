import Dream from '@/app/nouns/dreams/create/_components/Dream'
import NounTraits from '@/components/NounTraits'
import ProjectProvider from '@/components/Provider/Project'
import Header from '@/app/nouns/dreams/create/_components/Header'

export default async function Page() {
    return (
        <ProjectProvider>
            <NounTraits project="Nouns">
                <Header />

                <main>
                    <Dream />
                </main>
            </NounTraits>
        </ProjectProvider>
    )
}
