'use client'

import React, { useContext, useEffect, useState } from 'react'
import AuctionContext from '@/utils/contexts/AuctionContext'
import RpcContext from '@/utils/contexts/RpcContext'
import { formatEther } from 'ethers'
import Auction from '@/utils/dto/Auction'

const AuctionProvider: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    const { nounsAuctionContract } = useContext(RpcContext)
    const [auction, setAuction] = useState<Auction>()

    async function getAuctionDetails() {
        if (!nounsAuctionContract)
            throw Error('Nouns auction contract not found')

        const { nounId, amount, startTime, endTime, bidder, settled } =
            await nounsAuctionContract.auction()

        setAuction({
            nounId: Number(nounId),
            amount: formatEther(amount),
            startTime: Number(startTime),
            endTime: Number(endTime),
            bidder,
            settled,
        })
    }

    useEffect(() => {
        getAuctionDetails()
    }, [])

    return (
        <AuctionContext.Provider value={{ auction }}>
            {children}
        </AuctionContext.Provider>
    )
}

export default AuctionProvider
