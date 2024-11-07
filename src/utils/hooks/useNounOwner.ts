'use client'

import { useContext, useEffect, useState } from 'react'
import TokenContractContext from '@/utils/contexts/TokenContractContext'

const useNounOwner = (nounId?: number) => {
    const { httpTokenContract: contract } = useContext(TokenContractContext)
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
