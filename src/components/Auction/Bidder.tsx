'use client'

import AuctionContext from '@/utils/contexts/AuctionContext'
import { useContext } from 'react'
import EtherscanLink from '@/components/EtherscanLink'
import EthAddress from '@/components/EthAddress'

const AuctionBidder: React.FC<{ className?: string }> = ({ className }) => {
    const { auction } = useContext(AuctionContext)

    if (!auction) return null

    return (
        <EtherscanLink
            address={auction.bidder}
            className={className}
            type="Address"
        >
            <EthAddress address={auction.bidder} />
        </EtherscanLink>
    )
}

export default AuctionBidder
