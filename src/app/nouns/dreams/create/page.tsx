import HeaderIsland from '@/components/Header/Island/Island'
import DreamForm from '@/components/DreamPage/DreamForm'
import NounTraits from '@/components/NounTraits'
import ProjectProvider from '@/components/Provider/Project'

export default async function Page() {
    return (
        <ProjectProvider project="Nouns">
            <NounTraits project="Nouns">
                <HeaderIsland />

                <main>
                    <DreamForm />
                </main>
            </NounTraits>
        </ProjectProvider>
    )
}
