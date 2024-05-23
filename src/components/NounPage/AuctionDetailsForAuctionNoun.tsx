'use client'

import AuctionContext from '@/utils/contexts/AuctionContext'
import { useContext } from 'react'
import NounPageAuctionDetails from '@/components/NounPage/AuctionDetails'
import ContractTransactionReceipt from '@/utils/dto/ContractTransactionReceipt'

const NounPageAuctionDetailsForAuctionNoun: React.FC<{
    receipt?: ContractTransactionReceipt
}> = ({ receipt }) => {
    const { auction } = useContext(AuctionContext)

    if (!auction) return null

    return <NounPageAuctionDetails nounId={auction.nounId} receipt={receipt} />
}

export default NounPageAuctionDetailsForAuctionNoun
