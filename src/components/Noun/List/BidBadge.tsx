import AuctionContext from '@/utils/contexts/AuctionContext'
import useAuctionStatus from '@/utils/services/useAuctionStatus'
import { Londrina_Solid } from 'next/font/google'
import { useContext } from 'react'

const londrinaSolid = Londrina_Solid({
    subsets: ['latin'],
    weight: '400',
})

type Props = {
    nounId: number
}

const NounListBidBage: React.FC<Props> = ({ nounId }) => {
    const { auction } = useContext(AuctionContext)

    const auctionActive = useAuctionStatus(auction)

    if (!auction) return null

    if (!auctionActive) return null

    if (auction.nounId !== nounId) return null

    return (
        <div
            className={`bg-[#FFEF2E] px-2 py-0.5 uppercase absolute right-0 top-0 text-[13px] translate-x-1 -translate-y-1 ${londrinaSolid.className}`}
        >
            Bid
        </div>
    )
}

export default NounListBidBage
