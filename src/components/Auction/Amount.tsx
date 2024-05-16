'use client'

import { useContext } from 'react'
import AuctionContext from '@/utils/contexts/AuctionContext'

function AuctionAmount() {
    const { auction } = useContext(AuctionContext)

    return auction ? <p>Current bid: {auction.amount}</p> : <></>
}

export default AuctionAmount
