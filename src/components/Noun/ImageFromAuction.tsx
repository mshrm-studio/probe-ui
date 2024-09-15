'use client'

import RpcContext from '@/utils/contexts/RpcContext'
import React, { useContext } from 'react'
import NounImageFromId from '@/components/Noun/ImageFromId'
import AuctionContext from '@/utils/contexts/AuctionContext'

type Props = {
    className?: string
}

const NounImageFromAuction: React.FC<Props> = ({ className = '' }) => {
    const { auction } = useContext(AuctionContext)

    if (!auction) return null

    return <NounImageFromId className={className} nounId={auction.nounId} />
}

export default NounImageFromAuction
