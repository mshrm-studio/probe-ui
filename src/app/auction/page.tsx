'use client'

import CryptoWalletAddress from '@/components/CryptoWallet/Address'
import CryptoWalletConnect from '@/components/CryptoWallet/Connect'
import AuctionDetails from '@/components/Auction/Details'

export default function Page() {
    return (
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

                <div>
                    <AuctionDetails />
                </div>
            </div>
        </div>
    )
}
