import Dreams from '@/app/nouns/dreams/_components/Dreams'
import ProjectProvider from '@/components/Provider/Project'
import NounTraits from '@/components/NounTraits'
import FilterDisplayProvider from '@/components/Provider/FilterDisplay'
import Filters from '@/app/nouns/dreams/_components/Filters'
import DimensionsProvider from '@/components/Provider/Dimensions'
import Header from '@/app/nouns/dreams/_components/Header'

export default function Page() {
    return (
        <ProjectProvider project="Nouns">
            <NounTraits project="Nouns">
                <FilterDisplayProvider>
                    <DimensionsProvider>
                        <div className="p-4 space-y-4">
                            <Header />

                            <main className="space-y-6">
                                <div className="pr-2">
                                    <Filters />
                                </div>

                                <Dreams />
                            </main>
                        </div>
                    </DimensionsProvider>
                </FilterDisplayProvider>
            </NounTraits>
        </ProjectProvider>
    )
}
