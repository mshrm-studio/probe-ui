'use client'

import { useContext, useEffect, useState } from 'react'
import RpcContext from '@/utils/contexts/RpcContext'

const useNounOwner = (nounId?: number) => {
    const { httpNounsTokenContract: contract } = useContext(RpcContext)
    const [owner, setOwner] = useState<string>()

    useEffect(() => {
        if (!contract || !nounId) return

        const fetchOwner = async () => {
            try {
                const owner = await contract.ownerOf(nounId)

                setOwner(owner)
            } catch (error) {
                console.error('Failed to fetch owner:', error)
            }
        }

        fetchOwner()
    }, [nounId])

    return owner
}

export default useNounOwner
