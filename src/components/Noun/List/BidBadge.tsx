import AuctionContext from '@/utils/contexts/AuctionContext'
import { DateTime } from 'luxon'
import { useContext, useMemo } from 'react'

type Props = {
    nounId: number
}

const NounListBidBage: React.FC<Props> = ({ nounId }) => {
    const { auction } = useContext(AuctionContext)

    const auctionActive = useMemo(() => {
        if (!auction) return false

        if (auction.nounId !== nounId) return false

        const endTime = DateTime.fromSeconds(auction.endTime)

        return endTime.diff(DateTime.now()).milliseconds > 0
    }, [auction])

    return auctionActive ? (
        <div className="bg-[#FFEF2E] text-black px-2 py-0.5 uppercase absolute right-0 bottom-0 text-[13px]">
            Bid
        </div>
    ) : (
        <></>
    )
}

export default NounListBidBage
