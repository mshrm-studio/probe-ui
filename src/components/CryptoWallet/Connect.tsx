'use client'

import { useWeb3Modal } from '@web3modal/ethers/react'
import React from 'react'
import Button from '@/components/Button'

export default function CryptoWalletConnect({
    children,
}: {
    children: React.ReactNode
}) {
    const { open } = useWeb3Modal()

    return <Button onClick={() => open()}>{children}</Button>
}
