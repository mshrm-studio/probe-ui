'use client'

import React, { useContext, useEffect, useState } from 'react'
import RpcContext from '@/utils/contexts/RpcContext'
import { Contract } from 'ethers'
import { nounsDreamContractABI } from '@/utils/contracts/NounsDreamContractABI'
import DreamContractContext from '@/utils/contexts/DreamContractContext'

type Props = {
    children: React.ReactNode
}

const DreamContractProvider: React.FC<Props> = ({ children }) => {
    const { httpProvider } = useContext(RpcContext)
    const [httpDreamContract, setHttpDreamContract] = useState<Contract>()

    useEffect(() => {
        setHttpDreamContract(
            new Contract(
                process.env.NEXT_PUBLIC_NOUNS_DREAM_CONTRACT_ADDRESS as string,
                nounsDreamContractABI,
                httpProvider
            )
        )
    }, [])

    return (
        <DreamContractContext.Provider
            value={{
                httpDreamContract,
            }}
        >
            {children}
        </DreamContractContext.Provider>
    )
}

export default DreamContractProvider
