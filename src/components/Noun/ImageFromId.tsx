'use client'

import RpcContext from '@/utils/contexts/RpcContext'
import React, { useContext, useEffect, useState } from 'react'
import NounImage from '@/components/Noun/Image'

type Props = {
    className?: string
    nounId: number
}

const NounImageFromId: React.FC<Props> = ({ className = '', nounId }) => {
    const { httpNounsTokenContract: contract } = useContext(RpcContext)
    const [tokenUri, setTokenUri] = useState<string>()

    useEffect(() => {
        if (!contract) {
            console.error('Contract is not available')
            return
        }

        const fetchTokenUri = async () => {
            try {
                const uri = await contract.tokenURI(nounId)

                setTokenUri(uri)
            } catch (error) {
                console.error('Failed to fetch data URI:', error)
            }
        }

        fetchTokenUri()
    }, [contract, nounId])

    return <NounImage className={className} tokenUri={tokenUri} />
}

export default NounImageFromId
