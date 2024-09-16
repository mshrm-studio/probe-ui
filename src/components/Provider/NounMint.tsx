'use client'

import NounMintContext from '@/utils/contexts/NounMintContext'
import RpcContext from '@/utils/contexts/RpcContext'
import { ZeroAddress } from 'ethers'
import { useContext, useEffect, useState } from 'react'

type Props = {
    nounId: number
    children: React.ReactNode
}

const NounMintProvider: React.FC<Props> = ({ nounId, children }) => {
    const [blockHash, setBlockHash] = useState<string>()
    const [blockNumber, setBlockNumber] = useState<number>()
    const [blockTimestamp, setBlockTimestamp] = useState<number>()

    const { httpNounsTokenContract: contract, httpProvider: provider } =
        useContext(RpcContext)

    useEffect(() => {
        if (!contract || !provider) return

        console.log('fetchTokenTransfers:', nounId)

        const fetchTokenTransfers = async () => {
            try {
                const filter = contract.filters.Transfer(
                    ZeroAddress,
                    null,
                    nounId
                )

                // first block to latest block
                const logs = await contract.queryFilter(filter, 0, 'latest')

                console.log('tokenTransferLogs:', logs, typeof logs)

                if (Array.isArray(logs) && logs.length === 0) {
                    console.warn(`No mint event found for noun ID ${nounId}`)
                }

                const log = logs[0]

                setBlockHash(log.blockHash)

                const block = await provider.getBlock(log.blockHash)

                if (!block) {
                    console.warn(`Block not found for hash: ${log.blockHash}`)
                } else {
                    setBlockNumber(block.number)
                    setBlockTimestamp(block.timestamp)
                }
            } catch (error) {
                console.error('Failed to fetch mint data:', error)
            }
        }

        fetchTokenTransfers()
    }, [contract, provider, nounId])

    return (
        <NounMintContext.Provider
            value={{ blockHash, blockNumber, blockTimestamp }}
        >
            {children}
        </NounMintContext.Provider>
    )
}

export default NounMintProvider
