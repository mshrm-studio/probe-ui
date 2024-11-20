import AuctionHouseContractProvider from '@/components/Provider/AuctionHouseContract'
import TokenContractProvider from '@/components/Provider/TokenContract'
import NounTraits from '@/components/NounTraits'
import FilterDisplayProvider from '@/components/Provider/FilterDisplay'
import ProjectProvider from '@/components/Provider/Project'

type Props = {
    children: React.ReactNode
}

export default function LilNounsLayout({ children }: Props) {
    const project = 'LilNouns'

    return (
        <AuctionHouseContractProvider project={project}>
            <TokenContractProvider project={project}>
                <ProjectProvider>
                    <NounTraits project={project}>
                        <FilterDisplayProvider>
                            {children}
                        </FilterDisplayProvider>
                    </NounTraits>
                </ProjectProvider>
            </TokenContractProvider>
        </AuctionHouseContractProvider>
    )
}
