'use client'

import RpcContext from '@/utils/contexts/RpcContext'
import { useContext, useEffect, useMemo, useState } from 'react'
import MintDate from '@/components/Noun/MintDate'
import EthAddress from '@/components/EthAddress'
import EtherscanLink from '@/components/EtherscanLink'
import Noun from '@/utils/dto/Noun'

type Props = {
    noun: Noun
}

const NounPageSettlementDetails: React.FC<Props> = ({ noun }: Props) => {
    const { httpNounsAuctionHouseContract: contract } = useContext(RpcContext)
    const [failed, setFailed] = useState(false)
    const [winner, setWinner] = useState('')

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
                Settled by{' '}
                <EtherscanLink address={winner} type="Address">
                    <EthAddress address={winner} />
                </EtherscanLink>{' '}
                on <MintDate mintedAt={noun.minted_at} />
            </span>
        )

    return <MintDate mintedAt={noun.minted_at} />
}

export default NounPageSettlementDetails
