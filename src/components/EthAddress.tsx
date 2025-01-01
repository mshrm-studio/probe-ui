'use client'

import RpcContext from '@/utils/contexts/RpcContext'
import { useContext, useEffect, useMemo, useState } from 'react'

const EthAddress: React.FC<{ address: string; shorten?: boolean }> = ({
    address,
    shorten = true,
}) => {
    const { httpProvider } = useContext(RpcContext)

    const [ensName, setEnsName] = useState<string | null>(null)

    useEffect(() => {
        if (!httpProvider || !address) return

        const fetchEnsName = async () => {
            try {
                const name = await httpProvider.lookupAddress(address)

                setEnsName(name)
            } catch (error) {
                console.error('Error fetching ENS name:', error)
            }
        }

        fetchEnsName()
    }, [address, httpProvider])

    const textToDisplay = useMemo(() => {
        if (ensName)
            return ensName.length > 11
                ? `${ensName.slice(0, 8)}..${ensName.slice(-4)}`
                : ensName

        if (!shorten) return address

        return `${address.slice(0, 4)}...${address.slice(-4)}`
    }, [address, ensName, shorten])

    return <span>{textToDisplay}</span>
}

export default EthAddress
