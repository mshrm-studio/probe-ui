'use client'

import RpcContext from '@/utils/contexts/RpcContext'
import { useContext, useEffect, useMemo, useState } from 'react'
import MintDate from '@/components/Noun/MintDate'
import EthAddress from '@/components/EthAddress'
import EtherscanLink from '@/components/EtherscanLink'
import Noun from '@/utils/dto/Noun'
import MintedAt from '@/components/NounPage/MintedAt'
import Link from 'next/link'

type Props = {
    noun: Noun
}

const NounPageSettlementDetails: React.FC<Props> = ({ noun }: Props) => {
    const { httpNounsAuctionHouseContract: contract, httpProvider: provider } =
        useContext(RpcContext)
    const [failed, setFailed] = useState(false)
    const [winner, setWinner] = useState<string>()
    const [blockNumber, setBlockNumber] = useState<number>()
    const [settledByAddress, setSettledByAddress] = useState<string>()
    const [clientId, setClientId] = useState<number>()

    const client = useMemo(() => {
        if (!clientId) return null

        const clientMap = [
            { id: 1, name: 'noundry', url: 'https://www.noundry.wtf' },
            { id: 2, name: 'House of Nouns' },
            { id: 3, name: 'Camp', url: 'https://nouns.camp' },
            { id: 4, name: 'Nouns.biz', url: 'https://nouns.biz' },
            { id: 5, name: 'NounSwap', url: 'https://www.nounswap.wtf' },
            { id: 6, name: 'nouns.game', url: 'https://nouns.game' },
            { id: 7, name: 'Nouns Terminal', url: 'https://nouns.sh' },
            { id: 8, name: 'Nouns Esports', url: 'https://nouns.gg' },
            { id: 9, name: 'probe', url: 'https://probe.wtf' },
            { id: 10, name: 'Agora', url: 'https://nounsagora.com' },
            { id: 11, name: 'berries', url: 'https://nouns.farm' },
            {
                id: 12,
                name: 'Nouns Prop Launchpad',
                url: 'https://proplaunchpad.com',
            },
            {
                id: 13,
                name: 'etherscan donate address',
                url: 'https://www.etherscan.io',
            },
            { id: 14, name: 'pronouns', url: 'https://pronouns.gg' },
            { id: 15, name: 'Nouns Auction', url: 'https://nouns.auction' },
            { id: 16, name: 'Lighthouse' },
            {
                id: 17,
                name: 'nouns-protocol',
                url: 'https://github.com/obvious-inc/nouns-protocol',
            },
        ]

        return clientMap.find((client) => client.id === clientId)
    }, [clientId])

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
                            // blockTimestamp: settlement.blockTimestamp,
                            // amount: settlement.amount,
                            auctionWinner: settlement.winner,
                            // nounId: settlement.nounId,
                            auctionClientId: settlement.clientId,
                        }
                    })

                    if (settlements.length === 1) {
                        const { auctionClientId, auctionWinner } =
                            settlements[0]

                        if (typeof auctionWinner === 'string') {
                            setWinner(auctionWinner)
                        }

                        console.log(
                            'typeof auctionClientId',
                            typeof auctionClientId
                        )

                        if (typeof auctionClientId === 'bigint') {
                            setClientId(Number(auctionClientId))
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
                <MintedAt mintedAt={noun.minted_at} />

                <span className="mt-1 block">
                    Won by{' '}
                    <EtherscanLink
                        address={winner}
                        type="Address"
                        className="underline"
                    >
                        <EthAddress address={winner} />
                    </EtherscanLink>
                    {client && (
                        <span>
                            {' '}
                            via{' '}
                            {client.url ? (
                                <Link
                                    href={client.url}
                                    target="_blank"
                                    className="underline"
                                >
                                    {client.name}
                                </Link>
                            ) : (
                                client.name
                            )}
                        </span>
                    )}
                </span>

                {settledByAddress && (
                    <span className="mt-1 block">
                        Settled by{' '}
                        <EtherscanLink
                            address={settledByAddress}
                            type="Address"
                            className="underline"
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
