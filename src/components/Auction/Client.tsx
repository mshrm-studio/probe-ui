'use client'

import React from 'react'
import Link from 'next/link'
import Client from '@/utils/dto/Client'

type Props = {
    className?: string
    client: Client
}

const AuctionClient: React.FC<Props> = ({ className, client }) => {
    if (client.url)
        return (
            <Link href={client.url} target="_blank" className={className}>
                {client.name}
            </Link>
        )

    return <span className={className}>{client.name}</span>
}

export default AuctionClient
