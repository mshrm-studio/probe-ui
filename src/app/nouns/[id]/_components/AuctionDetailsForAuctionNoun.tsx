'use client'

import AuctionContext from '@/utils/contexts/AuctionContext'
import { useContext } from 'react'
import AuctionDetails from '@/app/nouns/[id]/_components/Auction/Details'
import ContractTransactionReceipt from '@/utils/dto/ContractTransactionReceipt'
import NounSettlementProvider from '@/components/Provider/NounSettlement'
import NounMintProvider from '@/components/Provider/NounMint'

const NounPageAuctionDetailsForAuctionNoun: React.FC<{
    receipt?: ContractTransactionReceipt
}> = ({ receipt }) => {
    const { auction } = useContext(AuctionContext)

    if (!auction) return null

    return (
        <NounSettlementProvider nounId={auction.nounId}>
            <NounMintProvider nounId={auction.nounId}>
                <AuctionDetails nounId={auction.nounId} receipt={receipt} />
            </NounMintProvider>
        </NounSettlementProvider>
    )
}

export default NounPageAuctionDetailsForAuctionNoun
