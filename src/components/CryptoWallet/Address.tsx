'use client'

import { useWeb3ModalAccount } from '@web3modal/ethers/react'

export default function CryptoWalletAddress() {
    const { address, chainId, isConnected } = useWeb3ModalAccount()

    if (address === undefined) return null

    return <>{address}</>
}
