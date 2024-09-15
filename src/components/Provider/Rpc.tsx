'use client'

import React, { useEffect, useState } from 'react'
import RpcContext from '@/utils/contexts/RpcContext'
import { Contract, JsonRpcProvider } from 'ethers'
import { nounsAuctionContractABI } from '@/utils/contracts/NounsAuctionContractABI'

const RpcProvider: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    const [httpProvider, setHttpProvider] = useState<JsonRpcProvider | null>(
        null
    )
    const [wsProvider, setWsProvider] = useState<JsonRpcProvider | null>(null)
    const [httpNounsAuctionContract, setHttpNounsAuctionContract] =
        useState<Contract | null>(null)
    const [wsNounsAuctionContract, setWsNounsAuctionContract] =
        useState<Contract | null>(null)

    useEffect(() => {
        const infuraApiKey = process.env.NEXT_PUBLIC_INFURA_API_KEY as string

        const nounsAuctionContractAddress = process.env
            .NEXT_PUBLIC_NOUNS_CONTRACT_ADDRESS as string

        const defaultChainId = parseInt(
            process.env.NEXT_PUBLIC_CHAIN_ID as string
        )

        const httpJsonRpcProvider = new JsonRpcProvider(
            defaultChainId == 1
                ? `https://mainnet.infura.io/v3/${infuraApiKey}`
                : `https://sepolia.infura.io/v3/${infuraApiKey}`
        )
        setHttpProvider(httpJsonRpcProvider)

        const httpContract = new Contract(
            nounsAuctionContractAddress,
            nounsAuctionContractABI,
            httpJsonRpcProvider
        )
        setHttpNounsAuctionContract(httpContract)

        const wsJsonRpcProvider = new JsonRpcProvider(
            defaultChainId == 1
                ? `wss://mainnet.infura.io/ws/v3/${infuraApiKey}`
                : `wss://sepolia.infura.io/ws/v3/${infuraApiKey}`
        )
        setWsProvider(wsJsonRpcProvider)

        const wsContract = new Contract(
            nounsAuctionContractAddress,
            nounsAuctionContractABI,
            wsJsonRpcProvider
        )
        setWsNounsAuctionContract(wsContract)
    }, [])

    return (
        <RpcContext.Provider
            value={{
                httpNounsAuctionContract,
                httpProvider,
                wsNounsAuctionContract,
                wsProvider,
            }}
        >
            {children}
        </RpcContext.Provider>
    )
}

export default RpcProvider
