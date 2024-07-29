'use client'

import NounListPage from '@/components/NounListPage/NounListPage'
import AuctionProvider from '@/components/Provider/Auction'

export default function Page() {
    return (
        <AuctionProvider>
            <NounListPage project="Nouns" />
        </AuctionProvider>
    )
}
