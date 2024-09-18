'use client'

import AuctionContext from '@/utils/contexts/AuctionContext'
import { Contract, parseEther } from 'ethers'
import React, { useContext } from 'react'
import { BrowserProvider } from 'ethers'
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from '@web3modal/ethers/react'
import ContractTransactionReceipt from '@/utils/dto/ContractTransactionReceipt'
import useAuctionStatus from '@/utils/services/useAuctionStatus'
import AuctionHouseContractContext from '@/utils/contexts/AuctionHouseContractContext'

const AuctionPlaceBid: React.FC<{
    children: React.ReactNode
    setReceipt: React.Dispatch<
        React.SetStateAction<ContractTransactionReceipt | undefined>
    >
}> = ({ children, setReceipt }) => {
    const { httpAuctionHouseContract: contract } = useContext(
        AuctionHouseContractContext
    )
    const { walletProvider } = useWeb3ModalProvider()
    const { auction } = useContext(AuctionContext)
    const { address } = useWeb3ModalAccount()
    const auctionActive = useAuctionStatus(auction)

    async function placeBid(event: React.FormEvent) {
        event.preventDefault()

        const formData = new FormData(event.target as HTMLFormElement)

        const payableAmount = formData.get('payableAmount')

        if (walletProvider === undefined) {
            alert('Wallet provider undefined')
            return
        }

        if (typeof payableAmount !== 'string' || !payableAmount) {
            alert('Payable amount not valid')
            return
        }

        if (!auction) {
            alert('Auction not found')
            return
        }

        if (!contract) {
            alert('Auction contract not found')
            return
        }

        const clientId = process.env.NEXT_PUBLIC_PROBE_NOUNS_CLIENT_ID

        if (typeof clientId !== 'string' || !clientId) {
            alert('Client ID not found')
            return
        }

        try {
            const provider = new BrowserProvider(walletProvider)
            const signer = await provider.getSigner()
            const contractWithSigner = contract.connect(signer) as Contract
            const value = parseEther(payableAmount)

            const bigIntGasEstimate =
                await contractWithSigner.createBid.estimateGas(
                    auction.nounId,
                    clientId,
                    {
                        value,
                    }
                )

            const bigIntGasLimit = bigIntGasEstimate + BigInt(10000) // A 10,000 gas pad is used to avoid 'Out of gas' errors

            const gasLimit = Number(bigIntGasLimit)

            const tx = await contractWithSigner.createBid(
                auction.nounId,
                clientId,
                {
                    value,
                    gasLimit,
                }
            )

            const receipt: ContractTransactionReceipt = await tx.wait()

            setReceipt(receipt)
        } catch (error: any) {
            console.log('error', error)

            alert(error?.info?.error?.message || error.code || 'Unknown Error')
        }
    }

    if (!auction) return null

    if (!auctionActive) return null

    if (auction.bidder == address) return null

    return <form onSubmit={placeBid}>{children}</form>
}

export default AuctionPlaceBid
