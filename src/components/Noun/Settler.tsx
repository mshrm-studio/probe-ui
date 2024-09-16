'use client'

import RpcContext from '@/utils/contexts/RpcContext'
import { useContext, useEffect, useState } from 'react'
import EtherscanLink from '@/components/EtherscanLink'
import EthAddress from '@/components/EthAddress'
import NounMintContext from '@/utils/contexts/NounMintContext'

type Props = {
    className?: string
}

const NounSettler: React.FC<Props> = ({ className }) => {
    const { httpNounsAuctionHouseContract: contract, httpProvider: provider } =
        useContext(RpcContext)
    const { blockNumber } = useContext(NounMintContext)
    const [settledByAddress, setSettledByAddress] = useState<string>()

    useEffect(() => {
        if (!blockNumber || !contract || !provider) return

        const fetchSettledEvents = async () => {
            try {
                const logs = await contract.queryFilter(
                    'AuctionSettled',
                    blockNumber,
                    blockNumber
                )

                if (Array.isArray(logs) && logs.length === 1) {
                    const auctionEvent = logs[0]

                    if (auctionEvent) {
                        const transaction = await provider.getTransaction(
                            auctionEvent.transactionHash
                        )

                        if (transaction) {
                            setSettledByAddress(transaction.from)
                        }
                    }
                }
            } catch (error) {
                console.error(
                    'Failed to fetch "Settled" auction events:',
                    error
                )
            }
        }

        fetchSettledEvents()
    }, [contract, blockNumber])

    if (!settledByAddress) return null

    return (
        <EtherscanLink
            address={settledByAddress}
            className={className}
            type="Address"
        >
            <EthAddress address={settledByAddress} />
        </EtherscanLink>
    )
}

export default NounSettler
