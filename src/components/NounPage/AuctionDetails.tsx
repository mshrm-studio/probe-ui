'use client'

import EthPrice from '@/components/EthPrice'
import AuctionContext from '@/utils/contexts/AuctionContext'
import { useContext, useMemo } from 'react'
import styles from '@/utils/styles/nounPage.module.css'
import AuctionCountdown from '@/components/Auction/Countdown'
import { DateTime } from 'luxon'
import ContractTransactionReceipt from '@/utils/dto/ContractTransactionReceipt'
import EtherscanLink from '@/components/EtherscanLink'
import useAuctionStatus from '@/utils/services/useAuctionStatus'

const NounPageAuctionDetails: React.FC<{
    nounId: number
    receipt?: ContractTransactionReceipt
}> = ({ nounId, receipt }) => {
    const { auction, reservePrice } = useContext(AuctionContext)

    const auctionActive = useAuctionStatus(auction)

    const truncatedBidderAddress = useMemo(() => {
        if (!auction) return

        return `${auction.bidder.substring(0, 6)}...${auction.bidder.substring(
            auction.bidder.length - 4
        )}`
    }, [auction])

    const bidLabel = useMemo(() => {
        if (!auction) return

        if (reservePrice === undefined || reservePrice === null) return

        if (auctionActive) return 'Current bid'

        return reservePrice > parseFloat(auction.amount)
            ? 'Highest bid (below reserve)'
            : 'Winning bid'
    }, [auctionActive, reservePrice])

    const countdownLabel = useMemo(() => {
        return auctionActive ? 'Auction ends in' : 'Auction ended at'
    }, [auctionActive])

    const truncatedReceiptHash = useMemo(() => {
        if (!receipt) return

        return `${receipt.hash.substring(0, 6)}...${receipt.hash.substring(
            receipt.hash.length - 4
        )}`
    }, [auction])

    if (!auction) return null

    if (reservePrice === undefined || reservePrice === null) return null

    if (auction.nounId !== nounId) return null

    return (
        <dl className="space-y-1">
            <div className={styles.dlItemInline}>
                <dt className={styles.dt}>{bidLabel}:</dt>{' '}
                <dd className={styles.dd}>
                    <EthPrice amount={auction.amount} /> by{' '}
                    {truncatedBidderAddress}
                </dd>
            </div>

            {receipt && truncatedReceiptHash && (
                <div className={styles.dlItemInline}>
                    <dt className={styles.dt}>Receipt:</dt>{' '}
                    <dd className={styles.dd}>
                        <EtherscanLink
                            address={receipt.hash}
                            className="text-link"
                            type="Transaction"
                        >
                            {truncatedReceiptHash}
                        </EtherscanLink>
                    </dd>
                </div>
            )}

            <div className={styles.dlItemInline}>
                <dt className={styles.dt}>{countdownLabel}:</dt>{' '}
                <dd className={styles.dd}>
                    {auctionActive ? (
                        <AuctionCountdown />
                    ) : (
                        DateTime.fromSeconds(auction.endTime).toLocaleString(
                            DateTime.DATETIME_MED
                        )
                    )}
                </dd>
            </div>
        </dl>
    )
}

export default NounPageAuctionDetails
