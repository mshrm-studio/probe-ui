'use client'

import RpcContext from '@/utils/contexts/RpcContext'
import { EventLog, Log } from 'ethers'
import { useContext, useEffect, useMemo, useState } from 'react'
import MintDate from '@/components/Noun/MintDate'
import EthAddress from '@/components/EthAddress'
import EtherscanLink from '@/components/EtherscanLink'

type Props = {
    blockNumber: number
    mintedAt: string
}

const NounPageSettlementDetails: React.FC<Props> = ({
    blockNumber,
    mintedAt,
}: Props) => {
    const { nounsAuctionContract: contract } = useContext(RpcContext)
    const [auctionEvents, setAuctionEvents] = useState<(EventLog | Log)[]>([])
    const [failed, setFailed] = useState(false)

    useEffect(() => {
        if (!contract) return

        const fetchSettledEvents = async () => {
            try {
                const auctionEvents = await contract.queryFilter(
                    'AuctionSettled',
                    blockNumber,
                    blockNumber
                )

                setAuctionEvents(auctionEvents)
            } catch (error) {
                console.error(
                    'Failed to fetch "Settled" auction events:',
                    error
                )
                setFailed(true)
            }
        }

        fetchSettledEvents()
    }, [contract, blockNumber])

    const winner = useMemo(() => {
        if (auctionEvents.length === 0) return null

        const auctionEvent = auctionEvents[0]

        if (!('args' in auctionEvent)) return null

        if (Array.isArray(auctionEvent.args) && auctionEvent.args.length > 1)
            return auctionEvent.args[1] as string

        const args = auctionEvent.args

        return args.winner ?? null
    }, [contract, auctionEvents])

    if (failed)
        return (
            <span className="text-red-500 font-bold">
                Error fetching settlement details
            </span>
        )

    if (winner)
        return (
            <span>
                Settled by{' '}
                <EtherscanLink address={winner} type="Address">
                    <EthAddress address={winner} />
                </EtherscanLink>{' '}
                on <MintDate mintedAt={mintedAt} />
            </span>
        )

    return null
}

export default NounPageSettlementDetails
