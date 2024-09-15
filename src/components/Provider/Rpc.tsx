'use client'

import React, { useEffect, useState } from 'react'
import RpcContext from '@/utils/contexts/RpcContext'
import { Contract, JsonRpcProvider, WebSocketProvider } from 'ethers'
import { nounsAuctionHouseContractABI } from '@/utils/contracts/NounsAuctionHouseContractABI'
import { nounsTokenContractABI } from '@/utils/contracts/NounsTokenContractABI'

const RpcProvider: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    const [httpProvider, setHttpProvider] = useState<JsonRpcProvider | null>(
        null
    )
    const [wsProvider, setWsProvider] = useState<WebSocketProvider | null>(null)
    const [httpNounsAuctionHouseContract, setHttpNounsAuctionHouseContract] =
        useState<Contract | null>(null)
    const [httpNounsTokenContract, setHttpNounsTokenContract] =
        useState<Contract | null>(null)
    const [wsNounsAuctionHouseContract, setWsNounsAuctionHouseContract] =
        useState<Contract | null>(null)

    useEffect(() => {
        const defaultChainId = parseInt(
            process.env.NEXT_PUBLIC_CHAIN_ID as string
        )

        const chain = defaultChainId == 1 ? 'mainnet' : 'sepolia'

        const infuraApiKey = process.env.NEXT_PUBLIC_INFURA_API_KEY as string

        const nounsAuctionHouseContractAddress = process.env
            .NEXT_PUBLIC_NOUNS_AUCTION_HOUSE_CONTRACT_ADDRESS as string

        const nounsTokenContractAddress = process.env
            .NEXT_PUBLIC_NOUNS_TOKEN_CONTRACT_ADDRESS as string

        const httpJsonRpcProvider = new JsonRpcProvider(
            `https://${chain}.infura.io/v3/${infuraApiKey}`
        )

        setHttpProvider(httpJsonRpcProvider)

        setHttpNounsAuctionHouseContract(
            new Contract(
                nounsAuctionHouseContractAddress,
                nounsAuctionHouseContractABI,
                httpJsonRpcProvider
            )
        )

        setHttpNounsTokenContract(
            new Contract(
                nounsTokenContractAddress,
                nounsTokenContractABI,
                httpJsonRpcProvider
            )
        )

        const websocketProvider = new WebSocketProvider(
            `wss://${chain}.infura.io/ws/v3/${infuraApiKey}`
        )

        setWsProvider(websocketProvider)

        setWsNounsAuctionHouseContract(
            new Contract(
                nounsAuctionHouseContractAddress,
                nounsAuctionHouseContractABI,
                websocketProvider
            )
        )
    }, [])

    return (
        <RpcContext.Provider
            value={{
                httpNounsAuctionHouseContract,
                httpNounsTokenContract,
                httpProvider,
                wsNounsAuctionHouseContract,
                wsProvider,
            }}
        >
            {children}
        </RpcContext.Provider>
    )
}

export default RpcProvider
