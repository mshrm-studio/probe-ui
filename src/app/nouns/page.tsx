'use client'

import NounListPage from '@/components/NounListPage/v2/NounListPage'
import AuctionProvider from '@/components/Provider/Auction'

export default function Page() {
    return (
        <AuctionProvider>
            <div className="px-4">
                <NounListPage project="Nouns" />
            </div>
        </AuctionProvider>
    )
}
