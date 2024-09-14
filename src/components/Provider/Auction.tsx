'use client'

import React, { useContext, useEffect, useState } from 'react'
import AuctionContext from '@/utils/contexts/AuctionContext'
import RpcContext from '@/utils/contexts/RpcContext'
import { formatEther } from 'ethers'
import Auction from '@/utils/dto/Auction'

const AuctionProvider: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    const { nounsAuctionContract: contract } = useContext(RpcContext)

    const [auction, setAuction] = useState<Auction>()

    async function fetchAuctionDetails() {
        if (!contract) {
            console.error('Nouns auction contract not found')
            alert('Nouns auction contract not found')
            return
        }

        try {
            const { nounId, amount, startTime, endTime, bidder, settled } =
                await contract.auction()

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
            alert('Failed to fetch auction details')
        }
    }

    const [minBidIncrementPercentage, setMinBigIncrementPercentage] =
        useState<number>()

    async function fetchMinBigIncrementPercentage() {
        if (!contract) {
            console.error('Nouns auction contract not found')
            alert('Nouns auction contract not found')
            return
        }

        try {
            const pc = await contract.minBidIncrementPercentage()

            setMinBigIncrementPercentage(Number(pc))
        } catch (error) {
            console.error(
                'Failed to fetch auction min bid increment percentage',
                error
            )
            alert('Failed to fetch auction min bid increment percentage')
        }
    }

    const [reservePrice, setReservePrice] = useState<number>()

    async function fetchReservePrice() {
        if (!contract) {
            console.error('Nouns auction contract not found')
            alert('Nouns auction contract not found')
            return
        }

        try {
            const reserve = await contract.reservePrice()

            setReservePrice(Number(reserve))
        } catch (error) {
            console.error('Failed to fetch auction reserve price', error)
            alert('Failed to fetch auction reserve price')
        }
    }

    useEffect(() => {
        fetchAuctionDetails()
        fetchMinBigIncrementPercentage()
        fetchReservePrice()
    }, [])

    // const handleAuctionBid = (
    //     nounId: number,
    //     sender: string,
    //     value: string,
    //     extended: boolean
    // ) => {
    //     alert(
    //         `New bid placed. NounId: ${nounId}, Sender: ${sender}, Value: ${formatEther(
    //             value
    //         )}, Extended: ${extended}`
    //     )

    //     setAuction((prev) => {
    //         if (!prev) return prev // Ensure previous auction state exists

    //         return {
    //             ...prev,
    //             amount: formatEther(value), // Convert value from wei to ether
    //             bidder: sender,
    //         }
    //     })
    // }

    // useEffect(() => {
    //     if (!contract) return

    //     // Subscribe to events with an arrow function that calls the handler
    //     contract.on('AuctionBid', (nounId, sender, value, extended) =>
    //         handleAuctionBid(nounId, sender, value, extended)
    //     )

    //     // Cleanup listeners on component unmount
    //     return () => {
    //         contract.off('AuctionBid', (nounId, sender, value, extended) =>
    //             handleAuctionBid(nounId, sender, value, extended)
    //         )
    //     }
    // }, [contract])

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
