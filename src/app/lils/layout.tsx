import AuctionHouseContractProvider from '@/components/Provider/AuctionHouseContract'
import TokenContractProvider from '@/components/Provider/TokenContract'

type Props = {
    children: React.ReactNode
}

export default function LilsLayout({ children }: Props) {
    return (
        <AuctionHouseContractProvider project="LilNouns">
            <TokenContractProvider project="LilNouns">
                {children}
            </TokenContractProvider>
        </AuctionHouseContractProvider>
    )
}
