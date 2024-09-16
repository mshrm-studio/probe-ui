'use client'

import { useContext } from 'react'
import NounSettlementContext from '@/utils/contexts/NounSettlementContext'
import EthPrice from '@/components/EthPrice'

const AuctionWinningBid: React.FC<{ className?: string }> = ({ className }) => {
    const { amount } = useContext(NounSettlementContext)

    if (!amount) return null

    return <EthPrice amount={amount} />
}

export default AuctionWinningBid
