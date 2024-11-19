import AuctionHouseContractProvider from '@/components/Provider/AuctionHouseContract'
import TokenContractProvider from '@/components/Provider/TokenContract'
import AuctionProvider from '@/components/Provider/Auction'
import NounTraits from '@/components/NounTraits'
import DimensionsProvider from '@/components/Provider/Dimensions'
import FilterDisplayProvider from '@/components/Provider/FilterDisplay'
import ProjectProvider from '@/components/Provider/Project'

type Props = {
    children: React.ReactNode
}

export default function NounsLayout({ children }: Props) {
    const project = 'Nouns'

    return (
        <AuctionHouseContractProvider project={project}>
            <TokenContractProvider project={project}>
                <AuctionProvider>
                    <ProjectProvider>
                        <NounTraits project={project}>
                            <FilterDisplayProvider>
                                {children}
                            </FilterDisplayProvider>
                        </NounTraits>
                    </ProjectProvider>
                </AuctionProvider>
            </TokenContractProvider>
        </AuctionHouseContractProvider>
    )
}
