'use client'

import { useContext } from 'react'
import AuctionContext from '@/utils/contexts/AuctionContext'
import { DateTime } from 'luxon'

function AuctionAmount() {
    const { auction } = useContext(AuctionContext)

    return auction ? (
        <p>
            End time:{' '}
            {DateTime.fromSeconds(auction.endTime).toFormat(
                'dd LLL yyyy HH:mm:ss'
            )}
        </p>
    ) : (
        <></>
    )
}

export default AuctionAmount
