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

    async function fetchAuctionDetails() {
        if (!nounsAuctionContract) {
            console.error('Nouns auction contract not found')
            return
        }

        try {
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
        } catch (error) {
            console.error('Failed to fetch auction details', error)
        }
    }

    const [minBidIncrementPercentage, setMinBigIncrementPercentage] =
        useState<number>()

    async function fetchMinBigIncrementPercentage() {
        if (!nounsAuctionContract) {
            console.error('Nouns auction contract not found')
            return
        }

        try {
            const pc = await nounsAuctionContract.minBidIncrementPercentage()

            setMinBigIncrementPercentage(Number(pc))
        } catch (error) {
            console.error(
                'Failed to fetch auction min bid increment percentage',
                error
            )
        }
    }

    const [reservePrice, setReservePrice] = useState<number>()

    async function fetchReservePrice() {
        if (!nounsAuctionContract) {
            console.error('Nouns auction contract not found')
            return
        }

        try {
            const reserve = await nounsAuctionContract.reservePrice()

            setReservePrice(Number(reserve))
        } catch (error) {
            console.error('Failed to fetch auction reserve price', error)
        }
    }

    useEffect(() => {
        fetchAuctionDetails()
        fetchMinBigIncrementPercentage()
        fetchReservePrice()
    }, [nounsAuctionContract])

    return (
        <AuctionContext.Provider
            value={{
                auction,
                minBidIncrementPercentage,
                reservePrice,
                fetchAuctionDetails,
            }}
        >
            {children}
        </AuctionContext.Provider>
    )
}

export default AuctionProvider
