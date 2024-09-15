'use client'

import AuctionContext from '@/utils/contexts/AuctionContext'
import RpcContext from '@/utils/contexts/RpcContext'
import { Contract, parseEther } from 'ethers'
import React, { useContext } from 'react'
import { BrowserProvider } from 'ethers'
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from '@web3modal/ethers/react'
import ContractTransactionReceipt from '@/utils/dto/ContractTransactionReceipt'
import useAuctionStatus from '@/utils/services/useAuctionStatus'

const AuctionPlaceBid: React.FC<{
    children: React.ReactNode
    setReceipt: React.Dispatch<
        React.SetStateAction<ContractTransactionReceipt | undefined>
    >
}> = ({ children, setReceipt }) => {
    const { httpNounsAuctionContract: contract } = useContext(RpcContext)
    const { walletProvider } = useWeb3ModalProvider()
    const { auction } = useContext(AuctionContext)
    const { address } = useWeb3ModalAccount()
    const auctionActive = useAuctionStatus(auction)

    async function placeBid(event: React.FormEvent) {
        event.preventDefault()

        const formData = new FormData(event.target as HTMLFormElement)

        const payableAmount = formData.get('payableAmount')

        if (walletProvider === undefined)
            throw Error('Wallet provider undefined')

        if (typeof payableAmount !== 'string' || !payableAmount)
            throw Error('Payable amount not valid')

        if (!auction) throw Error('Auction not found')

        if (!contract) throw Error('Auction contract not found')

        const clientId = process.env.NEXT_PUBLIC_PROBE_NOUNS_CLIENT_ID

        if (typeof clientId !== 'string' || !clientId)
            throw Error('Client ID not found')

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
