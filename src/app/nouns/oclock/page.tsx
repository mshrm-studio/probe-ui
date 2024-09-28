import DreamContractProvider from '@/components/Provider/DreamContract'
import AuctionDreamSettle from '@/components/Auction/DreamSettle'
export default function Page() {
    return (
        <DreamContractProvider>
            <AuctionDreamSettle />
        </DreamContractProvider>
    )
}
