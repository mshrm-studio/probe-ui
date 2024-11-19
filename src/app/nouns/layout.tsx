import AuctionHouseContractProvider from '@/components/Provider/AuctionHouseContract'
import TokenContractProvider from '@/components/Provider/TokenContract'
import AuctionProvider from '@/components/Provider/Auction'

type Props = {
    children: React.ReactNode
}

export default function NounsLayout({ children }: Props) {
    const project = 'Nouns'

    return (
        <AuctionHouseContractProvider project={project}>
            <TokenContractProvider project={project}>
                <AuctionProvider>{children}</AuctionProvider>
            </TokenContractProvider>
        </AuctionHouseContractProvider>
    )
}
