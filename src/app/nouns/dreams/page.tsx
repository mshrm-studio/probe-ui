import Filters from '@/app/nouns/dreams/_components/Filters'
import DreamList from '@/app/nouns/dreams/_components/DreamList'
import ProjectProvider from '@/components/Provider/Project'
import NounTraits from '@/components/NounTraits'

export default function Page() {
    return (
        <ProjectProvider project="Nouns">
            <NounTraits project="Nouns">
                <Filters />

                <DreamList />
            </NounTraits>
        </ProjectProvider>
    )
}
