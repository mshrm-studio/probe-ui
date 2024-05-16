'use client'

import EthPrice from '@/components/EthPrice'
import AuctionContext from '@/utils/contexts/AuctionContext'
import { useContext, useMemo } from 'react'
import styles from '@/utils/styles/nounPage.module.css'
import AuctionCountdown from '@/components/Auction/Countdown'
import { DateTime } from 'luxon'

const NounPageAuctionDetails: React.FC<{ nounId: number }> = ({ nounId }) => {
    const { auction } = useContext(AuctionContext)

    const auctionActive = useMemo(() => {
        if (!auction) return false

        const endTime = DateTime.fromSeconds(auction.endTime)

        return endTime.diff(DateTime.now()).milliseconds > 0
    }, [auction])

    return auction && auction.nounId == nounId && auctionActive ? (
        <section>
            <dl className="space-y-1">
                <div className={styles.dlItemInline}>
                    <dt className={styles.dt}>Current bid:</dt>{' '}
                    <dd className={styles.dd}>
                        <EthPrice amount={auction.amount} />
                    </dd>
                </div>

                <div className={styles.dlItemInline}>
                    <dt className={styles.dt}>Auction ends in:</dt>{' '}
                    <dd className={styles.dd}>
                        <AuctionCountdown auction={auction} />
                    </dd>
                </div>
            </dl>
        </section>
    ) : (
        <></>
    )
}

export default NounPageAuctionDetails
