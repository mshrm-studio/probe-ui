'use client'

import { useContext, useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import AuctionContext from '@/utils/contexts/AuctionContext'

function AuctionCountdown() {
    const { auction } = useContext(AuctionContext)
    const [countdown, setCountdown] = useState<string>('0')
    const [countdownInterval, setCountdownInterval] = useState<NodeJS.Timeout>()

    function calculateTimeLeft() {
        if (auction) {
            const endTime = DateTime.fromSeconds(auction.endTime)

            const timeLeft = endTime.diff(DateTime.now(), [
                'hours',
                'minutes',
                'seconds',
            ])

            if (timeLeft.as('seconds') <= 0) {
                setCountdown('0')
            } else {
                const { hours, minutes, seconds } = timeLeft.toObject()

                if (
                    typeof hours === 'number' &&
                    typeof minutes === 'number' &&
                    typeof seconds === 'number'
                ) {
                    setCountdown(
                        `${Math.floor(hours)}H ${Math.floor(
                            minutes
                        )}M ${Math.floor(seconds)}S`
                    )
                } else {
                    setCountdown('0')
                }
            }
        } else {
            setCountdown('0')
        }
    }

    useEffect(() => {
        calculateTimeLeft() // Call immediately to initialize countdown
        const interval = setInterval(calculateTimeLeft, 1000) // Call every second
        setCountdownInterval(interval)

        return () => {
            if (countdownInterval) clearInterval(countdownInterval) // Cleanup interval on component unmount
        }
    }, [auction]) // Depend on auction to recalculate when it changes

    return auction && countdown !== '0' ? (
        <p>Auction ends in: {countdown}</p>
    ) : (
        <></>
    )
}

export default AuctionCountdown
