'use client'

import { useWeb3ModalAccount } from '@web3modal/ethers/react'
import { useMemo } from 'react'

export default function CryptoWalletAddress() {
    const { address, chainId, isConnected } = useWeb3ModalAccount()

    const ethAddress = useMemo(() => {
        return isConnected && address ? address : '0xN0Tl0gg3d1n'
    }, [address, isConnected])

    return <span>{ethAddress}</span>
}
