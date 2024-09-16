'use client'

import AuctionContext from '@/utils/contexts/AuctionContext'
import { useContext, useMemo } from 'react'
import styles from '@/utils/styles/nounPage.module.css'
import AuctionCountdown from '@/components/Auction/Countdown'
import ContractTransactionReceipt from '@/utils/dto/ContractTransactionReceipt'
import EtherscanLink from '@/components/EtherscanLink'
import useAuctionStatus from '@/utils/services/useAuctionStatus'
import EthAddress from '@/components/EthAddress'
import AuctionClient from '@/components/Auction/Client'
import NounMintDate from '@/components/Noun/MintDate'
import useNounOwner from '@/utils/services/useNounOwner'
import useAuctionClient from '@/utils/services/useAuctionClient'
import NounSettlementContext from '@/utils/contexts/NounSettlementContext'
import NounMintContext from '@/utils/contexts/NounMintContext'
import EthPrice from '@/components/EthPrice'
import useNounSettler from '@/utils/services/useNounSettler'

const NounPageAuctionDetails: React.FC<{
    nounId: number
    receipt?: ContractTransactionReceipt
}> = ({ nounId, receipt }) => {
    const { auction } = useContext(AuctionContext)
    const auctionActive = useAuctionStatus(auction)
    const currentNounOwner = useNounOwner(nounId)
    const { amount, clientId, winner } = useContext(NounSettlementContext)
    const auctionClient = useAuctionClient(clientId)
    const { blockTimestamp } = useContext(NounMintContext)
    const settlerAddress = useNounSettler()

    const nounIsUpForAuction = useMemo(() => {
        return auctionActive && auction && auction.nounId === nounId
            ? true
            : false
    }, [auctionActive, auction, nounId])

    return (
        <dl className="space-y-1">
            {blockTimestamp && (
                <div className={styles.dlItemInline}>
                    <dt className={styles.dt}>Minted:</dt>
                    <dd className={styles.dd}>
                        <NounMintDate mintedAt={blockTimestamp} />
                    </dd>
                </div>
            )}

            {settlerAddress && (
                <div className={styles.dlItemInline}>
                    <dt className={styles.dt}>Settled by:</dt>
                    <dd className={styles.dd}>
                        <EtherscanLink
                            className="text-link"
                            address={settlerAddress}
                            type="Address"
                        >
                            <EthAddress address={settlerAddress} />
                        </EtherscanLink>
                    </dd>
                </div>
            )}

            {auction && nounIsUpForAuction && (
                <div className={styles.dlItemInline}>
                    <dt className={styles.dt}>Auction ends in:</dt>
                    <dd className={styles.dd}>
                        <AuctionCountdown />
                    </dd>
                </div>
            )}

            {auction && nounIsUpForAuction && (
                <div className={styles.dlItemInline}>
                    <dt className={styles.dt}>Current bid:</dt>
                    <dd className={styles.dd}>
                        <EthPrice amount={auction.amount} /> by{' '}
                        <EtherscanLink
                            address={auction.bidder}
                            className="text-link"
                            type="Address"
                        >
                            <EthAddress address={auction.bidder} />
                        </EtherscanLink>
                    </dd>
                </div>
            )}

            {!nounIsUpForAuction && amount && winner && (
                <div className={styles.dlItemInline}>
                    <dt className={styles.dt}>Winning bid:</dt>
                    <dd className={styles.dd}>
                        <EthPrice amount={amount} /> by{' '}
                        <EtherscanLink
                            className="text-link"
                            address={winner}
                            type="Address"
                        >
                            <EthAddress address={winner} />
                        </EtherscanLink>
                        {auctionClient && (
                            <span>
                                {' '}
                                via{' '}
                                <AuctionClient
                                    className="text-link"
                                    client={auctionClient}
                                />
                            </span>
                        )}
                    </dd>
                </div>
            )}

            {!nounIsUpForAuction && currentNounOwner && (
                <div className={styles.dlItemInline}>
                    <dt className={styles.dt}>Current owner:</dt>
                    <dd className={styles.dd}>
                        <EtherscanLink
                            address={currentNounOwner}
                            className="text-link"
                            type="Address"
                        >
                            <EthAddress address={currentNounOwner} />
                        </EtherscanLink>
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
