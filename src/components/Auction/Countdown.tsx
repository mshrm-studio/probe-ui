'use client'

import React, {
    useContext,
    useEffect,
    useMemo,
    useState,
    useCallback,
} from 'react'
import { DateTime } from 'luxon'
import AuctionContext from '@/utils/contexts/AuctionContext'

const AuctionCountdown: React.FC = () => {
    const { auction } = useContext(AuctionContext)
    const [countdown, setCountdown] = useState<string>('0')

    const calculateTimeLeft = useCallback(() => {
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
    }, [auction])

    useEffect(() => {
        calculateTimeLeft() // Call immediately to initialize countdown

        const interval = setInterval(calculateTimeLeft, 1000) // Call every second

        return () => clearInterval(interval)
    }, [auction]) // Depend on calculateTimeLeft to recalculate when it changes

    const timeLeft = useMemo(() => {
        return auction && countdown !== '0' ? countdown : null
    }, [auction, countdown])

    if (timeLeft === null) return null

    return <>{timeLeft}</>
}

export default AuctionCountdown
