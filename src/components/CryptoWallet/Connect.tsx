'use client'

import { useWeb3Modal } from '@web3modal/ethers/react'
import React from 'react'

export default function CryptoWalletConnect({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) {
    const { open } = useWeb3Modal()

    return (
        <button className={className} onClick={() => open()}>
            {children}
        </button>
    )
}
