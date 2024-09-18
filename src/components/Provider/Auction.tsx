'use client'

import React, { useContext, useEffect, useState } from 'react'
import AuctionContext from '@/utils/contexts/AuctionContext'
import { formatEther } from 'ethers'
import Auction from '@/utils/dto/Auction'
import AuctionHouseContractContext from '@/utils/contexts/AuctionHouseContractContext'

const AuctionProvider: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    const { httpAuctionHouseContract: auctionHouse } = useContext(
        AuctionHouseContractContext
    )

    const [auction, setAuction] = useState<Auction>()

    async function fetchAuctionDetails() {
        if (!auctionHouse) return

        try {
            const { nounId, amount, startTime, endTime, bidder, settled } =
                await auctionHouse.auction()

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
            // alert('Failed to fetch auction details')
        }
    }

    const [minBidIncrementPercentage, setMinBigIncrementPercentage] =
        useState<number>()

    async function fetchMinBigIncrementPercentage() {
        if (!auctionHouse) return

        try {
            const pc = await auctionHouse.minBidIncrementPercentage()

            setMinBigIncrementPercentage(Number(pc))
        } catch (error) {
            console.error(
                'Failed to fetch auction min bid increment percentage',
                error
            )
            // alert('Failed to fetch auction min bid increment percentage')
        }
    }

    const [reservePrice, setReservePrice] = useState<number>()

    async function fetchReservePrice() {
        if (!auctionHouse) return

        try {
            const reserve = await auctionHouse.reservePrice()

            setReservePrice(Number(reserve))
        } catch (error) {
            console.error('Failed to fetch auction reserve price', error)
            // alert('Failed to fetch auction reserve price')
        }
    }

    useEffect(() => {
        if (!auctionHouse) {
            console.warn('AuctionHouse contract not available')
            return
        }

        fetchAuctionDetails()
        fetchMinBigIncrementPercentage()
        fetchReservePrice()
    }, [auctionHouse])

    return (
        <AuctionContext.Provider
            value={{
                auction,
                minBidIncrementPercentage,
                reservePrice,
                fetchAuctionDetails,
                setAuction,
            }}
        >
            {children}
        </AuctionContext.Provider>
    )
}

export default AuctionProvider
