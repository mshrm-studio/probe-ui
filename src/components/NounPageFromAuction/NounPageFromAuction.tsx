import AuctionPlaceBid from '@/components/Auction/PlaceBid/PlaceBid'
import { useWeb3ModalAccount } from '@web3modal/ethers/react'
import Button from '@/components/Button'
import AuctionPlaceBidPayableAmount from '@/components/Auction/PlaceBid/PayableAmount'
import NounPageAuctionDetailsForAuctionNoun from '@/components/NounPage/AuctionDetailsForAuctionNoun'
import { useContext, useState } from 'react'
import ContractTransactionReceipt from '@/utils/dto/ContractTransactionReceipt'
import NounImageFromAuction from '@/components/Noun/ImageFromAuction'
import Header from '@/components/NounPage/Header'
import CryptoWalletConnect from '@/components/CryptoWallet/Connect'
import AuctionContext from '@/utils/contexts/AuctionContext'
import useLiveAuction from '@/utils/services/useLiveAuction'

const NounPageFromAuction: React.FC<{}> = () => {
    const { isConnected } = useWeb3ModalAccount()
    const [receipt, setReceipt] = useState<ContractTransactionReceipt>()
    const { auction } = useContext(AuctionContext)
    useLiveAuction(auction?.nounId, auction?.nounId)

    return (
        <>
            <Header />

            <main>
                <div className="py-6 px-4">
                    <div className="space-y-2 flex flex-col text-center items-center">
                        <NounImageFromAuction />

                        <NounPageAuctionDetailsForAuctionNoun
                            receipt={receipt}
                        />

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
            </main>
        </>
    )
}

export default NounPageFromAuction
