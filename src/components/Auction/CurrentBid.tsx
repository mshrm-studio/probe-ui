'use client'

import AuctionContext from '@/utils/contexts/AuctionContext'
import { useContext } from 'react'
import EthPrice from '@/components/EthPrice'

const AuctionCurrentBid: React.FC = () => {
    const { auction } = useContext(AuctionContext)

    if (!auction) return null

    return <EthPrice amount={auction.amount} />
}

export default AuctionCurrentBid
