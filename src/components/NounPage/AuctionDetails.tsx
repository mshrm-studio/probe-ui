'use client'

import AuctionContext from '@/utils/contexts/AuctionContext'
import { useContext, useMemo } from 'react'
import styles from '@/utils/styles/nounPage.module.css'
import AuctionCountdown from '@/components/Auction/Countdown'
import ContractTransactionReceipt from '@/utils/dto/ContractTransactionReceipt'
import EtherscanLink from '@/components/EtherscanLink'
import useAuctionStatus from '@/utils/services/useAuctionStatus'
import AuctionBidder from '@/components/Auction/Bidder'
import EthAddress from '@/components/EthAddress'
import AuctionClient from '@/components/Auction/Client'
import NounMintDate from '@/components/Noun/MintDate'
import NounSettler from '@/components/Noun/Settler'
import CurrentBid from '@/components/Auction/CurrentBid'
import WinningBid from '@/components/Auction/WinningBid'
import AuctionWinner from '@/components/Auction/Winner'

const NounPageAuctionDetails: React.FC<{
    nounId: number
    receipt?: ContractTransactionReceipt
}> = ({ nounId, receipt }) => {
    const { auction } = useContext(AuctionContext)

    const auctionActive = useAuctionStatus(auction)

    const nounIsUpForAuction = useMemo(() => {
        return auctionActive && auction?.nounId === nounId
    }, [auction, nounId])

    return (
        <dl className="space-y-1">
            <div className={styles.dlItemInline}>
                <dt className={styles.dt}>Minted:</dt>
                <dd className={styles.dd}>
                    <NounMintDate />
                </dd>
            </div>

            <div className={styles.dlItemInline}>
                <dt className={styles.dt}>Settled by:</dt>
                <dd className={styles.dd}>
                    <NounSettler className="text-link" />
                </dd>
            </div>

            {nounIsUpForAuction ? (
                <>
                    <div className={styles.dlItemInline}>
                        <dt className={styles.dt}>Auction ends in:</dt>
                        <dd className={styles.dd}>
                            <AuctionCountdown />
                        </dd>
                    </div>

                    <div className={styles.dlItemInline}>
                        <dt className={styles.dt}>Current bid:</dt>
                        <dd className={styles.dd}>
                            <CurrentBid /> by{' '}
                            <AuctionBidder className="text-link" />
                        </dd>
                    </div>
                </>
            ) : (
                <div className={styles.dlItemInline}>
                    <dt className={styles.dt}>Winning bid:</dt>
                    <dd className={styles.dd}>
                        <WinningBid /> by{' '}
                        <AuctionWinner className="text-link" /> via{' '}
                        <AuctionClient className="text-link" />
                    </dd>
                </div>
            )}

            {receipt && (
                <div className={styles.dlItemInline}>
                    <dt className={styles.dt}>Receipt:</dt>
                    <dd className={styles.dd}>
                        <EtherscanLink
                            address={receipt.hash}
                            className="text-link"
                            type="Transaction"
                        >
                            <EthAddress address={receipt.hash} />
                        </EtherscanLink>
                    </dd>
                </div>
            )}
        </dl>
    )
}

export default NounPageAuctionDetails
