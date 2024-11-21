'use client'

import { useWeb3ModalAccount } from '@web3modal/ethers/react'
import AuctionPlaceBid from '@/components/Auction/PlaceBid/PlaceBid'
import AuctionPlaceBidPayableAmount from '@/components/Auction/PlaceBid/PayableAmount'
import React from 'react'
import ContractTransactionReceipt from '@/utils/dto/ContractTransactionReceipt'
import Button from '@/components/Button'
import CryptoWalletConnect from '@/components/CryptoWallet/Connect'

type Props = {
    setReceipt: React.Dispatch<
        React.SetStateAction<ContractTransactionReceipt | undefined>
    >
}

const Bid: React.FC<Props> = ({ setReceipt }) => {
    const { isConnected } = useWeb3ModalAccount()

    return isConnected ? (
        <AuctionPlaceBid setReceipt={setReceipt}>
            <div className="flex space-x-2">
                <div>
                    <AuctionPlaceBidPayableAmount disabled={!isConnected} />
                </div>

                <div>
                    <Button disabled={!isConnected} nativeType="submit">
                        Bid
                    </Button>
                </div>
            </div>
        </AuctionPlaceBid>
    ) : (
        <CryptoWalletConnect>Login to bid</CryptoWalletConnect>
    )
}

export default Bid
