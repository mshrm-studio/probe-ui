import DreamForm from '@/app/nouns/dreams/create/_components/DreamForm'
import NounTraits from '@/components/NounTraits'
import ProjectProvider from '@/components/Provider/Project'
import Header from '@/components/Header/Noun'

export default async function Page() {
    return (
        <ProjectProvider>
            <NounTraits project="Nouns">
                <Header />

                <main>
                    <DreamForm />
                </main>
            </NounTraits>
        </ProjectProvider>
    )
}
