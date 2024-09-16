'use client'

import { useContext } from 'react'
import EtherscanLink from '@/components/EtherscanLink'
import EthAddress from '@/components/EthAddress'
import NounSettlementContext from '@/utils/contexts/NounSettlementContext'

const AuctionWinner: React.FC<{ className?: string }> = ({ className }) => {
    const { winner } = useContext(NounSettlementContext)

    if (!winner) return null

    return (
        <EtherscanLink address={winner} className={className} type="Address">
            <EthAddress address={winner} />
        </EtherscanLink>
    )
}

export default AuctionWinner
