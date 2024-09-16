'use client'

import NounSettlementContext from '@/utils/contexts/NounSettlementContext'
import RpcContext from '@/utils/contexts/RpcContext'
import { formatEther } from 'ethers'
import { useContext, useEffect, useState } from 'react'

type Props = {
    nounId: number
    children: React.ReactNode
}

const NounSettlementProvider: React.FC<Props> = ({ nounId, children }) => {
    const [amount, setAmount] = useState<string>()
    const [blockTimestamp, setBlockTimestamp] = useState<number>()
    const [clientId, setClientId] = useState<number>()
    const [winner, setWinner] = useState<string>()
    const { httpNounsAuctionHouseContract: contract } = useContext(RpcContext)

    useEffect(() => {
        if (!contract || !nounId) return

        if (typeof nounId !== 'number') {
            console.warn('Invalid nounId type:', typeof nounId)
            return
        }

        const fetchSettlements = async () => {
            try {
                const logs = await contract[
                    'getSettlements(uint256,uint256,bool)'
                ](nounId, nounId + 1, false)

                if (Array.isArray(logs) && logs.length === 1) {
                    setAmount(
                        typeof logs[0].amount === 'bigint'
                            ? formatEther(logs[0].amount)
                            : undefined
                    )

                    setBlockTimestamp(
                        typeof logs[0].blockTimestamp === 'bigint'
                            ? Number(logs[0].blockTimestamp)
                            : undefined
                    )

                    setClientId(
                        typeof logs[0].clientId === 'bigint'
                            ? Number(logs[0].clientId)
                            : undefined
                    )

                    setWinner(
                        typeof logs[0].winner === 'string'
                            ? logs[0].winner
                            : undefined
                    )
                }
            } catch (error) {
                console.error('Failed to fetch settlements:', error)
            }
        }

        fetchSettlements()
    }, [contract, nounId])

    return (
        <NounSettlementContext.Provider
            value={{ amount, blockTimestamp, clientId, winner }}
        >
            {children}
        </NounSettlementContext.Provider>
    )
}

export default NounSettlementProvider
