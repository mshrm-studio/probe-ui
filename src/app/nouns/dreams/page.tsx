import Dreams from '@/app/nouns/dreams/_components/Dreams'
import ProjectProvider from '@/components/Provider/Project'
import NounTraits from '@/components/NounTraits'
import HeaderIsland from '@/components/Header/Island/Island'
import HeaderIslandSpacer from '@/components/Header/Island/Spacer'
import FilterDisplayProvider from '@/components/Provider/FilterDisplay'
import Filters from '@/app/nouns/dreams/_components/Filters'
import DimensionsProvider from '@/components/Provider/Dimensions'

export default function Page() {
    return (
        <ProjectProvider project="Nouns">
            <NounTraits project="Nouns">
                <FilterDisplayProvider>
                    <DimensionsProvider>
                        <HeaderIsland />

                        <HeaderIslandSpacer />

                        <main className="mt-4 px-4 space-y-4">
                            <Filters />

                            <Dreams />
                        </main>
                    </DimensionsProvider>
                </FilterDisplayProvider>
            </NounTraits>
        </ProjectProvider>
    )
}
