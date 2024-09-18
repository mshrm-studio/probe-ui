import AuctionHouseContractProvider from '@/components/Provider/AuctionHouseContract'
import TokenContractProvider from '@/components/Provider/TokenContract'

type Props = {
    children: React.ReactNode
}

export default function NounsLayout({ children }: Props) {
    return (
        <AuctionHouseContractProvider project="Nouns">
            <TokenContractProvider project="Nouns">
                {children}
            </TokenContractProvider>
        </AuctionHouseContractProvider>
    )
}
