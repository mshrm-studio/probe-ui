'use client'

import CryptoWalletAddress from '@/components/CryptoWallet/Address'
import CryptoWalletConnect from '@/components/CryptoWallet/Connect'
import AuctionProvider from '@/components/Provider/Auction'

export default function Page() {
    return (
        <AuctionProvider>
            <div className="px-4">
                <div className="space-y-6">
                    <div>
                        <CryptoWalletConnect className="underline">
                            Login
                        </CryptoWalletConnect>
                    </div>

                    <div>
                        <CryptoWalletAddress />
                    </div>
                </div>
            </div>
        </AuctionProvider>
    )
}
