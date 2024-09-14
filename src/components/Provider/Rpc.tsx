'use client'

import React, { useEffect, useState } from 'react'
import RpcContext from '@/utils/contexts/RpcContext'
import { Contract, JsonRpcProvider } from 'ethers'
import { nounsAuctionContractABI } from '@/utils/contracts/NounsAuctionContractABI'

const RpcProvider: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    const [provider, setProvider] = useState<JsonRpcProvider | null>(null)
    const [nounsAuctionContract, setNounsAuctionContract] =
        useState<Contract | null>(null)

    useEffect(() => {
        const infuraApiKey = process.env.NEXT_PUBLIC_INFURA_API_KEY as string

        const nounsAuctionContractAddress = process.env
            .NEXT_PUBLIC_NOUNS_CONTRACT_ADDRESS as string

        const defaultChainId = parseInt(
            process.env.NEXT_PUBLIC_CHAIN_ID as string
        )

        const rpcUrl =
            defaultChainId == 1
                ? `https://mainnet.infura.io/v3/${infuraApiKey}`
                : `https://sepolia.infura.io/v3/${infuraApiKey}`

        const jsonRpcProvider = new JsonRpcProvider(rpcUrl)
        setProvider(jsonRpcProvider)

        const contract = new Contract(
            nounsAuctionContractAddress,
            nounsAuctionContractABI,
            jsonRpcProvider
        )

        setNounsAuctionContract(contract)
    }, [])

    return (
        <RpcContext.Provider value={{ nounsAuctionContract, provider }}>
            {children}
        </RpcContext.Provider>
    )
}

export default RpcProvider
