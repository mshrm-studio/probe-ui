'use client'

import React, { useContext, useEffect, useState } from 'react'
import RpcContext from '@/utils/contexts/RpcContext'
import { Contract } from 'ethers'
import { nounsAuctionHouseContractABI } from '@/utils/contracts/NounsAuctionHouseContractABI'
import { lilNounsAuctionHouseContractABI } from '@/utils/contracts/LilNounsAuctionHouseContractABI'
import AuctionHouseContractContext from '@/utils/contexts/AuctionHouseContractContext'
import Project from '@/utils/dto/Project'

type Props = {
    children: React.ReactNode
    project: Project
}

const AuctionHouseContractProvider: React.FC<Props> = ({
    children,
    project,
}) => {
    const { httpProvider, wsProvider } = useContext(RpcContext)
    const [httpAuctionHouseContract, setHttpAuctionHouseContract] =
        useState<Contract>()
    const [wsAuctionHouseContract, setWsAuctionHouseContract] =
        useState<Contract>()

    useEffect(() => {
        const auctionHouseContractAddres =
            project === 'Nouns'
                ? (process.env
                      .NEXT_PUBLIC_NOUNS_AUCTION_HOUSE_CONTRACT_ADDRESS as string)
                : (process.env
                      .NEXT_PUBLIC_LIL_NOUNS_AUCTION_HOUSE_CONTRACT_ADDRESS as string)

        const auctionHouseContractABI =
            project === 'Nouns'
                ? nounsAuctionHouseContractABI
                : lilNounsAuctionHouseContractABI

        setHttpAuctionHouseContract(
            new Contract(
                auctionHouseContractAddres,
                auctionHouseContractABI,
                httpProvider
            )
        )

        setWsAuctionHouseContract(
            new Contract(
                auctionHouseContractAddres,
                auctionHouseContractABI,
                wsProvider
            )
        )
    }, [project])

    return (
        <AuctionHouseContractContext.Provider
            value={{
                httpAuctionHouseContract,
                wsAuctionHouseContract,
            }}
        >
            {children}
        </AuctionHouseContractContext.Provider>
    )
}

export default AuctionHouseContractProvider
