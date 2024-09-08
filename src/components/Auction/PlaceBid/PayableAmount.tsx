'use client'

import { useContext, useMemo } from 'react'
import Input from '@/components/Input/Input'
import AuctionContext from '@/utils/contexts/AuctionContext'

const AuctionPlaceBidPayableAmount: React.FC<{ disabled?: boolean }> = ({
    disabled,
}) => {
    const { auction, minBidIncrementPercentage, reservePrice } =
        useContext(AuctionContext)

    const minBid = useMemo(() => {
        if (!auction) return

        if (!minBidIncrementPercentage) return

        if (!reservePrice) return

        const currentBid = parseFloat(auction.amount)

        const minBidIncrease = currentBid * (minBidIncrementPercentage / 100)

        return currentBid + minBidIncrease
    }, [auction, minBidIncrementPercentage, reservePrice])

    const placeholder = useMemo(() => {
        if (!minBid) return

        if (minBid <= 0) return 'Ξ Max bid'

        return `Ξ ${minBid} or more`
    }, [minBid])

    if (!auction) return null

    if (!minBidIncrementPercentage) return null

    if (!reservePrice) return null

    return (
        <Input
            disabled={disabled}
            name="payableAmount"
            min={
                process.env.NEXT_PUBLIC_CHAIN_ID === '1'
                    ? parseFloat(auction.amount)
                    : 0
            }
            step={process.env.NEXT_PUBLIC_CHAIN_ID === '1' ? '0.1' : '0.000001'}
            nativeType="number"
            placeholder={placeholder}
        />
    )
}

export default AuctionPlaceBidPayableAmount
