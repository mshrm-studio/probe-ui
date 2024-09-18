'use client'

import NounMintContext from '@/utils/contexts/NounMintContext'
import RpcContext from '@/utils/contexts/RpcContext'
import TokenContractContext from '@/utils/contexts/TokenContractContext'
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

    const { httpProvider: provider } = useContext(RpcContext)
    const { httpTokenContract: contract } = useContext(TokenContractContext)

    useEffect(() => {
        if (!contract || !provider) return

        const fetchTokenTransfers = async () => {
            try {
                const filter = contract.filters.Transfer(
                    ZeroAddress,
                    null,
                    nounId
                )

                // first block to latest block
                const logs = await contract.queryFilter(filter, 0, 'latest')

                if (Array.isArray(logs) && logs.length === 0) {
                    console.warn(`No mint event found for noun ID ${nounId}`)
                }

                const log = logs[0]

                setBlockHash(log.blockHash)

                const block = await provider.getBlock(log.blockHash)

                if (!block) {
                    console.error(`Block not found for hash: ${log.blockHash}`)
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
