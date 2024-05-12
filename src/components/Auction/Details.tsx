'use client'

import {
    useWeb3ModalProvider,
    useWeb3ModalAccount,
} from '@web3modal/ethers/react'
import { formatEther, BrowserProvider, Contract } from 'ethers'
import { useMemo, useState } from 'react'

const nounsContractAddress = process.env
    .NEXT_PUBLIC_NOUNS_CONTRACT_ADDRESS as string

const nounsContractABI = [
    // Read the current auction state
    'function auction() public view returns (uint256 nounId, uint128 amount, uint256 startTime, uint256 endTime, address bidder, bool settled)',

    // Function to place a bid on the current auction
    'function createBid(uint256 nounId) external payable',

    // Function to place a bid with a comment
    'function createBidWithComment(uint256 nounId, string comment) external payable',

    // Function to retrieve the duration of auctions
    'function duration() public view returns (uint256)',

    // Function to retrieve the minimum percentage difference between bids
    'function minBidIncrementPercentage() public view returns (uint8)',

    // Address of the Nouns ERC721 token contract
    'function nouns() public view returns (address)',

    // Address of the contract owner
    'function owner() public view returns (address)',

    // Check if the contract is paused
    'function paused() public view returns (bool)',

    // Minimum price accepted in an auction
    'function reservePrice() public view returns (uint192)',

    // Minimum time left in an auction after a new bid
    'function timeBuffer() public view returns (uint56)',

    // Address of the WETH contract
    'function weth() public view returns (address)',
]

function AuctionDetails() {
    const { address, isConnected } = useWeb3ModalAccount()

    const { walletProvider } = useWeb3ModalProvider()

    const [auctionDetails, setAuctionDetails] = useState<{
        nounId: number
        amount: string
        startTime: number
        endTime: number
        bidder: string
        settled: boolean
    }>()

    const auctionStartTimeAsDate = useMemo(() => {
        if (!auctionDetails) return null

        return new Date(auctionDetails.startTime * 1000)
    }, [auctionDetails?.startTime])

    const auctionEndTimeAsDate = useMemo(() => {
        if (!auctionDetails) return null

        return new Date(auctionDetails.startTime * 1000)
    }, [auctionDetails?.startTime])

    const [auctionDuration, setAuctionDuration] = useState<number>()

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

        // const auctionDetails = await nounsContract.auction()
        // console.log('auctionDetails', auctionDetails)
        //         console.log('auctionDetails.result', auctionDetails.result)

        const { nounId, amount, startTime, endTime, bidder, settled } =
            await nounsContract.auction()

        setAuctionDetails({
            nounId: Number(nounId),
            amount: formatEther(amount),
            startTime: Number(startTime),
            endTime: Number(endTime),
            bidder,
            settled,
        })

        console.log('nounId:', nounId.toString())
        console.log('amount:', formatEther(amount))
        console.log('startTime:', new Date(Number(startTime) * 1000))
        console.log('endTime:', new Date(Number(endTime) * 1000))
        console.log('bidder:', bidder)
        console.log('settled:', settled)

        getAuctionDuration()
    }

    async function getAuctionDuration() {
        if (!isConnected) throw Error('User disconnected')

        if (!walletProvider) throw Error('Wallet provider not found')

        const ethersProvider = new BrowserProvider(walletProvider)

        const signer = await ethersProvider.getSigner()

        const nounsContract = new Contract(
            nounsContractAddress,
            nounsContractABI,
            signer
        )

        const duration = await nounsContract.duration()

        setAuctionDuration(Number(duration))
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
        <div className="space-y-6">
            <div className="space-y-3">
                <button onClick={() => getAuctionDetails()}>
                    Get Auction Details
                </button>

                {auctionDetails && (
                    <ul>
                        <li>
                            <strong>Noun ID:</strong> {auctionDetails.nounId}
                        </li>

                        <li>
                            <strong>Amount:</strong> {auctionDetails.amount}
                        </li>

                        <li>
                            <strong>Start Time:</strong>{' '}
                            {auctionDetails.startTime.toString()}
                        </li>

                        {auctionStartTimeAsDate && (
                            <li>
                                <strong>Start Time (as date):</strong>{' '}
                                {auctionStartTimeAsDate.toString()}
                            </li>
                        )}

                        <li>
                            <strong>End Time:</strong>{' '}
                            {auctionDetails.endTime.toString()}
                        </li>

                        {auctionEndTimeAsDate && (
                            <li>
                                <strong>End Time (as date):</strong>{' '}
                                {auctionEndTimeAsDate.toString()}
                            </li>
                        )}

                        <li>
                            <strong>Bidder:</strong> {auctionDetails.bidder}
                        </li>

                        <li>
                            <strong>Settled:</strong>{' '}
                            {auctionDetails.settled.toString()}
                        </li>

                        {auctionDuration && (
                            <li>
                                <strong>Duration:</strong> {auctionDuration}
                            </li>
                        )}
                    </ul>
                )}
            </div>

            {auctionDetails && (
                <div>
                    <button
                        onClick={() => placeBid(auctionDetails.nounId, '1')}
                    >
                        Place Bid on Noun #{auctionDetails.nounId}
                    </button>
                </div>
            )}
        </div>
    )
}

export default AuctionDetails
