import AuctionContext from '@/utils/contexts/AuctionContext'
import useAuctionStatus from '@/utils/services/useAuctionStatus'
import { useContext, useMemo } from 'react'

type Props = {
    nounId: number
}

const NounListBidBage: React.FC<Props> = ({ nounId }) => {
    const { auction } = useContext(AuctionContext)

    const auctionActive = useAuctionStatus(auction)

    return auctionActive ? (
        <div className="bg-[#FFEF2E] text-black px-2 py-0.5 uppercase absolute right-0 bottom-0 text-[13px]">
            Bid
        </div>
    ) : (
        <></>
    )
}

export default NounListBidBage
