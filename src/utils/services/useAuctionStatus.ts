import { useState, useEffect } from 'react'
import { DateTime } from 'luxon'
import Auction from '@/utils/dto/Auction'

const useAuctionStatus = (auction?: Auction | null) => {
    const [active, setActive] = useState<boolean>(false)

    function checkAuctionStatus() {
        if (auction) {
            const endTime = DateTime.fromSeconds(auction.endTime)

            setActive(endTime > DateTime.now())
        }
    }

    useEffect(() => {
        checkAuctionStatus()

        const interval = setInterval(checkAuctionStatus, 1000)

        return () => clearInterval(interval)
    }, [auction])

    return active
}

export default useAuctionStatus
