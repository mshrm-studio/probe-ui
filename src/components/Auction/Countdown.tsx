'use client'

import React, { useContext, useEffect, useState, useCallback } from 'react'
import { DateTime } from 'luxon'
import AuctionContext from '@/utils/contexts/AuctionContext'
import useAuctionStatus from '@/utils/hooks/useAuctionStatus'

const AuctionCountdown: React.FC<{ className?: string }> = ({ className }) => {
    const { auction } = useContext(AuctionContext)
    const [timeRemaining, setTimeRemaining] = useState<string>('0')
    const auctionActive = useAuctionStatus(auction)

    const calculateTimeRemaining = useCallback(() => {
        if (auction) {
            const endTime = DateTime.fromSeconds(auction.endTime)
            const timeDifference = endTime.diff(DateTime.now(), [
                'hours',
                'minutes',
                'seconds',
            ])

            if (timeDifference.as('seconds') <= 0) {
                setTimeRemaining('0')
            } else {
                const { hours, minutes, seconds } = timeDifference.toObject()

                if (
                    typeof hours === 'number' &&
                    typeof minutes === 'number' &&
                    typeof seconds === 'number'
                ) {
                    setTimeRemaining(
                        `${Math.floor(hours)}H ${Math.floor(
                            minutes
                        )}M ${Math.floor(seconds)}S`
                    )
                } else {
                    setTimeRemaining('0')
                }
            }
        } else {
            setTimeRemaining('0')
        }
    }, [auction])

    useEffect(() => {
        if (auctionActive) {
            calculateTimeRemaining() // Call immediately to initialize countdown

            const interval = setInterval(calculateTimeRemaining, 1000) // Call every second

            return () => clearInterval(interval)
        }
    }, [auction, auctionActive])

    if (auction && auctionActive && timeRemaining !== '0') {
        return <span className={className}>{timeRemaining}</span>
    }

    return null
}

export default AuctionCountdown
