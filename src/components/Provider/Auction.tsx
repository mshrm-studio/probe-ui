'use client'

import React, { useContext, useEffect, useState } from 'react'
import AuctionContext from '@/utils/contexts/AuctionContext'
import RpcContext from '@/utils/contexts/RpcContext'
import { formatEther } from 'ethers'
import Auction from '@/utils/dto/Auction'

const AuctionProvider: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    const {
        httpNounsAuctionHouseContract: httpContract,
        wsNounsAuctionHouseContract: wsContract,
    } = useContext(RpcContext)

    const [auction, setAuction] = useState<Auction>()

    async function fetchAuctionDetails() {
        if (!httpContract) {
            console.error('Nouns auction contract not found')
            // alert('Nouns auction contract not found')
            return
        }

        try {
            const { nounId, amount, startTime, endTime, bidder, settled } =
                await httpContract.auction()

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
        if (!httpContract) {
            console.error('Nouns auction contract not found')
            // alert('Nouns auction contract not found')
            return
        }

        try {
            const pc = await httpContract.minBidIncrementPercentage()

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
        if (!httpContract) {
            console.error('Nouns auction contract not found')
            // alert('Nouns auction contract not found')
            return
        }

        try {
            const reserve = await httpContract.reservePrice()

            setReservePrice(Number(reserve))
        } catch (error) {
            console.error('Failed to fetch auction reserve price', error)
            // alert('Failed to fetch auction reserve price')
        }
    }

    useEffect(() => {
        fetchAuctionDetails()
        fetchMinBigIncrementPercentage()
        fetchReservePrice()
    }, [])

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
