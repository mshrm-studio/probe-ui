import DreamList from '@/app/nouns/dreams/_components/DreamList'
import ProjectProvider from '@/components/Provider/Project'
import NounTraits from '@/components/NounTraits'
import HeaderIsland from '@/components/Header/Island/Island'

export default function Page() {
    return (
        <ProjectProvider project="Nouns">
            <NounTraits project="Nouns">
                <HeaderIsland />

                <main>
                    <DreamList />
                </main>
            </NounTraits>
        </ProjectProvider>
    )
}
