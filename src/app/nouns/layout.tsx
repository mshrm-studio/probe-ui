import AuctionHouseContractProvider from '@/components/Provider/AuctionHouseContract'
import TokenContractProvider from '@/components/Provider/TokenContract'
import AuctionProvider from '@/components/Provider/Auction'

type Props = {
    children: React.ReactNode
}

export default function NounsLayout({ children }: Props) {
    return (
        <AuctionHouseContractProvider project="Nouns">
            <TokenContractProvider project="Nouns">
                <AuctionProvider>{children}</AuctionProvider>
            </TokenContractProvider>
        </AuctionHouseContractProvider>
    )
}
