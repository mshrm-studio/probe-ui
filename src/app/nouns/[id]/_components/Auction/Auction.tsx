'use client'

import ProjectContext from '@/utils/contexts/ProjectContext'
import { useContext, useState } from 'react'
import ContractTransactionReceipt from '@/utils/dto/ContractTransactionReceipt'
import AuctionContext from '@/utils/contexts/AuctionContext'
import useAuctionStatus from '@/utils/hooks/useAuctionStatus'
import useLiveAuction from '@/utils/hooks/useLiveAuction'
import Noun from '@/utils/dto/Noun'
import Bid from '@/app/nouns/[id]/_components/Auction/Bid'
import Details from '@/app/nouns/[id]/_components/Auction/Details'

export default function Auction({ noun }: { noun: Noun }) {
    const { project } = useContext(ProjectContext)
    const [receipt, setReceipt] = useState<ContractTransactionReceipt>()
    const { auction } = useContext(AuctionContext)
    const auctionActive = useAuctionStatus(auction)
    useLiveAuction(noun.token_id, auction?.nounId)

    return (
        <>
            <section className="mb-2">
                <Details nounId={noun.token_id} receipt={receipt} />
            </section>

            {project === 'Nouns' &&
                auction &&
                auctionActive &&
                auction.nounId == noun.token_id && (
                    <section>
                        <Bid setReceipt={setReceipt} />
                    </section>
                )}
        </>
    )
}
