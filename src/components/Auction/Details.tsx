'use client'

import {
    useWeb3ModalProvider,
    useWeb3ModalAccount,
} from '@web3modal/ethers/react'
import { BrowserProvider, Contract } from 'ethers'

// Nouns Contract Address and ABI
const nounsContractAddress = process.env
    .NEXT_PUBLIC_NOUNS_CONTRACT_ADDRESS_PROXY as string

const nounsContractABI = [
    // Include the entire ABI provided above
    'function auction() view returns (uint256, uint256, uint256, uint256, address payable, bool)',
    'function createBid(uint256 nounId) payable',
    'function createBidWithComment(uint256 nounId, string comment) payable',
    // More functions as needed...
]

function NounsComponent() {
    const { address, isConnected } = useWeb3ModalAccount()

    const { walletProvider } = useWeb3ModalProvider()

    async function getAuctionDetails() {
        if (!isConnected) throw Error('User disconnected')

        if (!walletProvider) throw Error('Wallet provider not found')

        const ethersProvider = new BrowserProvider(walletProvider)

        const signer = await ethersProvider.getSigner()

        const nounsContract = new Contract(
            nounsContractAddress,
            nounsContractABI,
            signer
        )

        const auctionDetails = await nounsContract.auction()
        console.log(auctionDetails)
    }

    async function placeBid(nounId: number, amount: string) {
        if (!isConnected) throw Error('User disconnected')

        if (!walletProvider) throw Error('Wallet provider not found')

        const ethersProvider = new BrowserProvider(walletProvider)

        const signer = await ethersProvider.getSigner()

        const nounsContract = new Contract(
            nounsContractAddress,
            nounsContractABI,
            signer
        )

        // Remember to send the correct amount of ETH with the transaction
        const tx = await nounsContract.createBid(nounId, { value: amount })

        console.log('tx', tx)
    }

    return (
        <div className="space-y-3">
            <div>
                <button onClick={() => getAuctionDetails()}>
                    Get Auction Details
                </button>
            </div>

            <div>
                <button onClick={() => placeBid(1, '1000000000000000000')}>
                    Place Bid on Noun #1
                </button>
            </div>
        </div>
    )
}

export default NounsComponent
