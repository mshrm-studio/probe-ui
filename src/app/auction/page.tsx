'use client'

import CryptoWalletAddress from '@/components/CryptoWallet/Address'
import CryptoWalletConnect from '@/components/CryptoWallet/Connect'
import AuctionProvider from '@/components/Provider/Auction'
import AuctionPlaceBid from '@/components/Auction/PlaceBid'
import { useWeb3ModalAccount } from '@web3modal/ethers/react'
import AuctionCountdown from '@/components/Auction/Countdown'
import AuctionCurrentBid from '@/components/Auction/CurrentBid'

export default function Page() {
    const { address, chainId, isConnected } = useWeb3ModalAccount()

    return (
        <AuctionProvider>
            <div className="px-4">
                <div className="space-y-6">
                    {isConnected ? (
                        <div className="flex flex-col space-y-2">
                            <CryptoWalletAddress />

                            <div>
                                <AuctionCountdown />
                            </div>

                            <div>
                                <AuctionCurrentBid />
                            </div>

                            <AuctionPlaceBid>
                                <div className="flex flex-col space-y-2">
                                    <div>
                                        <input
                                            className="border"
                                            name="payableAmount"
                                            step="0.001"
                                            type="number"
                                        />
                                    </div>

                                    <div>
                                        <button type="submit">place bid</button>
                                    </div>
                                </div>
                            </AuctionPlaceBid>
                        </div>
                    ) : (
                        <CryptoWalletConnect className="underline">
                            Login
                        </CryptoWalletConnect>
                    )}
                </div>
            </div>
        </AuctionProvider>
    )
}
