'use client'

import { useContext, useMemo } from 'react'
import Input from '@/components/Input/Input'
import AuctionContext from '@/utils/contexts/AuctionContext'

const AuctionPlaceBidPayableAmount: React.FC<{ disabled?: boolean }> = ({
    disabled,
}) => {
    const { auction, minBidIncrementPercentage } = useContext(AuctionContext)

    const minBid = useMemo(() => {
        if (!auction || minBidIncrementPercentage === undefined) return

        const currentBid = parseFloat(auction.amount)

        const minBidIncrease = currentBid * (minBidIncrementPercentage / 100)

        return currentBid + minBidIncrease
    }, [auction, minBidIncrementPercentage])

    const placeholder = useMemo(() => {
        if (!minBid) return

        if (minBid <= 0) return 'Ξ Max bid'

        return `Ξ ${parseFloat(minBid.toFixed(4))} or more`
    }, [minBid])

    if (!auction) return null

    return (
        <Input
            disabled={disabled}
            name="payableAmount"
            min={0}
            step={
                process.env.NEXT_PUBLIC_CHAIN_ID === '1' ? '0.0001' : '0.000001'
            }
            nativeType="number"
            placeholder={placeholder}
        />
    )
}

export default AuctionPlaceBidPayableAmount
