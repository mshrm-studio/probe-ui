'use client'

import React, { useContext, useEffect, useState } from 'react'
import RpcContext from '@/utils/contexts/RpcContext'
import { Contract } from 'ethers'
import { nounsTokenContractABI } from '@/utils/contracts/NounsTokenContractABI'
import { lilNounsTokenContractABI } from '@/utils/contracts/LilNounsTokenContractABI'
import TokenContractContext from '@/utils/contexts/TokenContractContext'
import Project from '@/utils/dto/Project'

type Props = {
    children: React.ReactNode
    project: Project
}

const TokenContractProvider: React.FC<Props> = ({ children, project }) => {
    const { httpProvider } = useContext(RpcContext)
    const [httpTokenContract, setHttpTokenContract] = useState<Contract>()

    useEffect(() => {
        const tokenContractAddres =
            project === 'Nouns'
                ? (process.env
                      .NEXT_PUBLIC_NOUNS_TOKEN_CONTRACT_ADDRESS as string)
                : (process.env
                      .NEXT_PUBLIC_LIL_NOUNS_TOKEN_CONTRACT_ADDRESS as string)

        const tokenContractABI =
            project === 'Nouns'
                ? nounsTokenContractABI
                : lilNounsTokenContractABI

        setHttpTokenContract(
            new Contract(tokenContractAddres, tokenContractABI, httpProvider)
        )
    }, [project])

    return (
        <TokenContractContext.Provider
            value={{
                httpTokenContract,
            }}
        >
            {children}
        </TokenContractContext.Provider>
    )
}

export default TokenContractProvider
