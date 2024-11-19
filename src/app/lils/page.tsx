import NounListPage from '@/app/nouns/_components/NounListPage'
import NounTraits from '@/components/NounTraits'
import ProjectProvider from '@/components/Provider/Project'

export default async function Page() {
    return (
        <ProjectProvider>
            <NounTraits project="LilNouns">
                <NounListPage project="LilNouns" />
            </NounTraits>
        </ProjectProvider>
    )
}
