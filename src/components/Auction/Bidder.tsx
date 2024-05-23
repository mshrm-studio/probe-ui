'use client'

import AuctionContext from '@/utils/contexts/AuctionContext'
import { useContext } from 'react'

const AuctionBidder: React.FC = () => {
    const { auction } = useContext(AuctionContext)

    if (!auction) return null

    return <>{auction.bidder}</>
}

export default AuctionBidder
