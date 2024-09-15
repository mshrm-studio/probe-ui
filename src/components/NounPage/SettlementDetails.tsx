'use client'

import RpcContext from '@/utils/contexts/RpcContext'
import { useContext, useEffect, useMemo, useState } from 'react'
import MintDate from '@/components/Noun/MintDate'
import EthAddress from '@/components/EthAddress'
import EtherscanLink from '@/components/EtherscanLink'
import Noun from '@/utils/dto/Noun'
import { EventLog, Log } from 'ethers'

type Props = {
    noun: Noun
}

const NounPageSettlementDetails: React.FC<Props> = ({ noun }: Props) => {
    const { httpNounsAuctionHouseContract: contract, httpProvider: provider } =
        useContext(RpcContext)
    const [failed, setFailed] = useState(false)
    const [winner, setWinner] = useState('')
    const [blockNumber, setBlockNumber] = useState<number>()
    const [settledByAddress, setSettledByAddress] = useState<string>()

    useEffect(() => {
        if (!provider || !noun) return

        const fetchBlockNumber = async () => {
            try {
                const block = await provider.getBlock(noun.block_number)

                if (block) {
                    setBlockNumber(block.number)
                }
            } catch (error) {
                console.error('Failed to fetch block number:', error)
            }
        }

        fetchBlockNumber()
    }, [noun, provider])

    useEffect(() => {
        if (!blockNumber || !contract || !provider) return

        const fetchSettledEvents = async () => {
            try {
                const response = await contract.queryFilter(
                    'AuctionSettled',
                    blockNumber,
                    blockNumber
                )

                if (
                    response &&
                    Array.isArray(response) &&
                    response.length === 1
                ) {
                    const auctionEvent = response[0]

                    if (auctionEvent) {
                        const txHash = auctionEvent.transactionHash

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
                setFailed(true)
            }
        }

        fetchSettledEvents()
    }, [contract, blockNumber])

    useEffect(() => {
        if (!contract || !noun) return

        const fetchSettlements = async () => {
            try {
                const response = await contract[
                    'getSettlements(uint256,uint256,bool)'
                ](noun.token_id, noun.token_id + 1, false)

                if (response && Array.isArray(response)) {
                    const settlements = response.map((settlement) => {
                        return {
                            blockTimestamp: settlement.blockTimestamp,
                            amount: settlement.amount,
                            winner: settlement.winner,
                            nounId: settlement.nounId,
                            clientId: settlement.clientId,
                        }
                    })

                    if (settlements.length === 1) {
                        const { winner } = settlements[0]

                        if (typeof winner === 'string') {
                            setWinner(winner)
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch settlements:', error)
                setFailed(true)
            }
        }

        fetchSettlements()
    }, [contract, noun])

    if (failed)
        return (
            <span className="text-red-500 font-bold">
                Error fetching settlement details
            </span>
        )

    if (winner)
        return (
            <span>
                <span>
                    Won by{' '}
                    <EtherscanLink address={winner} type="Address">
                        <EthAddress address={winner} />
                    </EtherscanLink>{' '}
                    on <MintDate mintedAt={noun.minted_at} />
                </span>

                {settledByAddress && (
                    <span className="mt-1 block">
                        Settled by{' '}
                        <EtherscanLink
                            address={settledByAddress}
                            type="Address"
                        >
                            <EthAddress address={settledByAddress} />
                        </EtherscanLink>
                    </span>
                )}
            </span>
        )

    return <MintDate mintedAt={noun.minted_at} />
}

export default NounPageSettlementDetails
