'use client'

import { useContext, useEffect } from 'react'
import AuctionContext from '@/utils/contexts/AuctionContext'
import { formatEther } from 'ethers'
import AuctionHouseContractContext from '@/utils/contexts/AuctionHouseContractContext'

const useLiveAuction = (nounId?: number, auctionNounId?: number) => {
    const { wsAuctionHouseContract: wsContract } = useContext(
        AuctionHouseContractContext
    )
    const { fetchAuctionDetails, setAuction } = useContext(AuctionContext)

    const handleAuctionBid = (
        nounId: number,
        sender: string,
        value: string,
        extended: boolean
    ) => {
        alert(
            `New bid placed. NounId: ${nounId}, Sender: ${sender}, Value: ${formatEther(
                value
            )}, Extended: ${extended}`
        )

        if (setAuction === undefined) return

        setAuction((prev) => {
            if (!prev) return prev // Ensure previous auction state exists

            return {
                ...prev,
                amount: formatEther(value), // Convert value from wei to ether
                bidder: sender,
            }
        })

        if (fetchAuctionDetails === undefined) return

        if (extended) {
            fetchAuctionDetails()
        }
    }

    useEffect(() => {
        if (!wsContract || !nounId || !auctionNounId) return

        if (nounId !== auctionNounId) return

        // Subscribe to events with an arrow function that calls the handler
        wsContract.on('AuctionBid', (nounId, sender, value, extended) => {
            handleAuctionBid(nounId, sender, value, extended)
        })

        // Cleanup listeners on component unmount
        return () => {
            wsContract.off('AuctionBid', (nounId, sender, value, extended) => {
                handleAuctionBid(nounId, sender, value, extended)
            })
        }
    }, [auctionNounId, nounId, wsContract])
}

export default useLiveAuction
