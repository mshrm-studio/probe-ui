'use client'

import CryptoWalletConnect from '@/components/CryptoWallet/Connect'
import AuctionProvider from '@/components/Provider/Auction'
import AuctionPlaceBid from '@/components/Auction/PlaceBid/PlaceBid'
import { useWeb3ModalAccount } from '@web3modal/ethers/react'
import Button from '@/components/Button'
import AuctionPlaceBidPayableAmount from '@/components/Auction/PlaceBid/PayableAmount'
import NounPageAuctionDetailsForAuctionNoun from '@/components/NounPage/AuctionDetailsForAuctionNoun'
import { useState } from 'react'
import ContractTransactionReceipt from '@/utils/dto/ContractTransactionReceipt'

export default function Page() {
    const { isConnected } = useWeb3ModalAccount()
    const [receipt, setReceipt] = useState<ContractTransactionReceipt>()

    return (
        <AuctionProvider>
            <div className="px-4">
                <div className="space-y-2">
                    <NounPageAuctionDetailsForAuctionNoun receipt={receipt} />

                    <AuctionPlaceBid setReceipt={setReceipt}>
                        <div className="flex space-x-2">
                            <div>
                                <AuctionPlaceBidPayableAmount
                                    disabled={!isConnected}
                                />
                            </div>

                            <div>
                                <Button
                                    disabled={!isConnected}
                                    nativeType="submit"
                                >
                                    Bid
                                </Button>
                            </div>
                        </div>
                    </AuctionPlaceBid>

                    {!isConnected && (
                        <CryptoWalletConnect>Login</CryptoWalletConnect>
                    )}
                </div>
            </div>
        </AuctionProvider>
    )
}
