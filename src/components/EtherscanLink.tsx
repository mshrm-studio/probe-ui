'use client'

import Link from 'next/link'
import React, { useMemo } from 'react'

type Props = {
    address: string
    children: React.ReactNode
    className?: string
    type: 'Address' | 'Transaction'
}

const EtherscanLink: React.FC<Props> = ({
    address,
    children,
    className,
    type,
}) => {
    const etherscanDirectory = useMemo(() => {
        return type === 'Transaction' ? 'tx' : type.toLowerCase()
    }, [type])

    const href = useMemo(() => {
        const chainId = process.env.NEXT_PUBLIC_CHAIN_ID as string

        return chainId == '1'
            ? `https://etherscan.io/${etherscanDirectory}/${address}`
            : `https://sepolia.etherscan.io/${etherscanDirectory}/${address}`
    }, [address, etherscanDirectory])

    return (
        <Link href={href} className={className} target="_blank">
            {children}
        </Link>
    )
}

export default EtherscanLink
