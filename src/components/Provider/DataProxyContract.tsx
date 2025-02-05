'use client'

import React, { useContext, useEffect, useState } from 'react'
import RpcContext from '@/utils/contexts/RpcContext'
import { Contract } from 'ethers'
import { nounsDataProxyContractABI } from '@/utils/contracts/NounsDataProxyContractABI'
import DataProxyContractContext from '@/utils/contexts/DataProxyContractContext'

type Props = {
    children: React.ReactNode
}

const DataProxyContractProvider: React.FC<Props> = ({ children }) => {
    const { httpProvider, wsProvider } = useContext(RpcContext)
    const [httpDataProxyContract, setHttpDataProxyContract] =
        useState<Contract>()
    const [wsDataProxyContract, setWsDataProxyContract] = useState<Contract>()

    useEffect(() => {
        // ONLY AVAILABLE FOR NOUNS (NOT LILS)

        const dataProxyContractAddress = process.env
            .NEXT_PUBLIC_NOUNS_DATA_PROXY_CONTRACT_ADDRESS as string

        const dataProxyContractABI = nounsDataProxyContractABI

        setHttpDataProxyContract(
            new Contract(
                dataProxyContractAddress,
                dataProxyContractABI,
                httpProvider
            )
        )

        setWsDataProxyContract(
            new Contract(
                dataProxyContractAddress,
                dataProxyContractABI,
                wsProvider
            )
        )
    }, [])

    return (
        <DataProxyContractContext.Provider
            value={{
                httpDataProxyContract,
                wsDataProxyContract,
            }}
        >
            {children}
        </DataProxyContractContext.Provider>
    )
}

export default DataProxyContractProvider
