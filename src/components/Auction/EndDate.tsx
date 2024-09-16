'use client'

import React, { useContext } from 'react'
import { DateTime } from 'luxon'
import AuctionContext from '@/utils/contexts/AuctionContext'

const AuctionEndDate: React.FC<{ className?: string }> = ({ className }) => {
    const { auction } = useContext(AuctionContext)

    if (!auction) return null

    return (
        <span className={className}>
            {DateTime.fromSeconds(auction.endTime).toFormat(
                'MMM d, yyyy h:mm a'
            )}
        </span>
    )
}

export default AuctionEndDate
