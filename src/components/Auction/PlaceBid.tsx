'use client'

import AuctionContext from '@/utils/contexts/AuctionContext'
import RpcContext from '@/utils/contexts/RpcContext'
import { Contract, parseEther } from 'ethers'
import { DateTime } from 'luxon'
import { useContext, useEffect, useState } from 'react'
import { BrowserProvider } from 'ethers'
import { useWeb3ModalProvider } from '@web3modal/ethers/react'
import { isAuctionContractError } from '@/utils/dto/AuctionContractError'

const AuctionPlaceBid: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    const { nounsAuctionContract } = useContext(RpcContext)
    const { walletProvider } = useWeb3ModalProvider()
    const { auction } = useContext(AuctionContext)

    async function placeBid(event: React.FormEvent) {
        event.preventDefault()

        const formData = new FormData(event.target as HTMLFormElement)

        const payableAmount = formData.get('payableAmount')

        if (walletProvider === undefined)
            throw Error('Wallet provider undefined')

        if (typeof payableAmount !== 'string' || !payableAmount)
            throw Error('Payable amount not valid')

        if (!auction) throw Error('Auction not found')

        if (!nounsAuctionContract) throw Error('Auction contract not found')

        const clientId = process.env.NEXT_PUBLIC_PROBE_NOUNS_CLIENT_ID

        if (typeof clientId !== 'string' || !clientId)
            throw Error('Client ID not found')

        try {
            const provider = new BrowserProvider(walletProvider)

            const signer = await provider.getSigner()

            const contractWithSigner = nounsAuctionContract.connect(
                signer
            ) as Contract

            const tx = await contractWithSigner.createBid(auction.nounId, {
                value: parseEther(payableAmount),
            })

            const receipt = await tx.wait()

            console.log('receipt', receipt)

            alert(
                `Bid placed successfully! Transaction Hash: ${
                    receipt.transactionHash
                }, Block Number: ${
                    receipt.blockNumber
                }, Gas Used: ${receipt.gasUsed.toString()}`
            )
        } catch (error: unknown) {
            console.log('error', error)

            if (isAuctionContractError(error)) {
                alert(error.info.error.message)
            } else {
                alert('Unknown error')
            }

            // console.log('error', error)
            // console.log('error.message', error.message)
            // console.log('error.code', error.code)
            // console.log('error.info', error.info)
            // console.log('error.info.error.code', error.info.error.code)
            // console.log('error.info.error.message', error.info.error.message)

            //             error.message insufficient funds (transaction={ "data": "0x659dd2b4000000000000000000000000000000000000000000000000000000000000045f", "from": "0xf193c62bf66a2da6f4fa5cacad6f75dcf7d7fa96", "to": "0x830bd73e4184cef73443c15111a1df14e495c706", "value": "0x120a871cc0020000" }, info={ "error": { "code": -32000, "message": "failed with 500000000 gas: insufficient funds for gas * price + value: address 0xf193C62Bf66A2da6f4fa5Cacad6F75DcF7D7fA96 have 9090258473707864 want 1300000000000000000" }, "payload": { "id": 5, "jsonrpc": "2.0", "method": "eth_estimateGas", "params": [ { "data": "0x659dd2b4000000000000000000000000000000000000000000000000000000000000045f", "from": "0xf193c62bf66a2da6f4fa5cacad6f75dcf7d7fa96", "to": "0x830bd73e4184cef73443c15111a1df14e495c706", "value": "0x120a871cc0020000" } ] } }, code=INSUFFICIENT_FUNDS, version=6.12.1)
            // PlaceBid.tsx:69 error.code INSUFFICIENT_FUNDS
            // PlaceBid.tsx:70 error.info {payload: {…}, error: {…}}
            // PlaceBid.tsx:71 error.info.error.code -32000
            // PlaceBid.tsx:72 error.info.error.message failed with 500000000 gas: insufficient funds for gas * price + value: address 0xf193C62Bf66A2da6f4fa5Cacad6F75DcF7D7fA96 have 9090258473707864 want 1300000000000000000
        }
    }

    const [hasFinished, setHasFinished] = useState<boolean>(true)

    function checkAuctionStatus() {
        if (auction) {
            const endTime = DateTime.fromSeconds(auction.endTime)

            setHasFinished(endTime <= DateTime.now())
        }
    }

    useEffect(() => {
        checkAuctionStatus()

        const interval = setInterval(checkAuctionStatus, 1000)

        return () => clearInterval(interval)
    }, [auction])

    if (hasFinished) return null

    return <form onSubmit={placeBid}>{children}</form>
}

export default AuctionPlaceBid
