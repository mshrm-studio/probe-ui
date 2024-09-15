'use client'

import AuctionProvider from '@/components/Provider/Auction'
import NounPageFromAuction from '@/components/NounPageFromAuction/NounPageFromAuction'

export default function Page() {
    return (
        <AuctionProvider>
            <NounPageFromAuction />
        </AuctionProvider>
    )
}
