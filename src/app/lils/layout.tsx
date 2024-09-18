import AuctionHouseContractProvider from '@/components/Provider/AuctionHouseContract'
import TokenContractProvider from '@/components/Provider/TokenContract'
import AuctionProvider from '@/components/Provider/Auction'

type Props = {
    children: React.ReactNode
}

export default function LilsLayout({ children }: Props) {
    return (
        <AuctionHouseContractProvider project="LilNouns">
            <TokenContractProvider project="LilNouns">
                <AuctionProvider>{children}</AuctionProvider>
            </TokenContractProvider>
        </AuctionHouseContractProvider>
    )
}
