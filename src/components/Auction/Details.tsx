'use client'

import {
    useWeb3ModalProvider,
    useWeb3ModalAccount,
} from '@web3modal/ethers/react'
import { formatEther, BrowserProvider, Contract, EventLog } from 'ethers'
import { useMemo, useState } from 'react'

const nounsContractAddress = process.env
    .NEXT_PUBLIC_NOUNS_CONTRACT_ADDRESS as string

// const nounsContractABI = [
//     // Read the current auction state
//     'function auction() public view returns (uint256 nounId, uint128 amount, uint256 startTime, uint256 endTime, address bidder, bool settled)',

//     // Function to place a bid on the current auction
//     'function createBid(uint256 nounId) external payable',

//     // Function to place a bid with a comment
//     'function createBidWithComment(uint256 nounId, string comment) external payable',

//     // Function to retrieve the duration of auctions
//     'function duration() public view returns (uint256)',

//     // Function to retrieve the minimum percentage difference between bids
//     'function minBidIncrementPercentage() public view returns (uint8)',

//     // Address of the Nouns ERC721 token contract
//     'function nouns() public view returns (address)',

//     // Address of the contract owner
//     'function owner() public view returns (address)',

//     // Check if the contract is paused
//     'function paused() public view returns (bool)',

//     // Minimum price accepted in an auction
//     'function reservePrice() public view returns (uint192)',

//     // Minimum time left in an auction after a new bid
//     'function timeBuffer() public view returns (uint56)',

//     // Address of the WETH contract
//     'function weth() public view returns (address)',

//     'event AuctionBid(uint256 indexed nounId, address indexed sender, uint256 value, bool extended)',
// ]

const nounsContractABI = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'uint256',
                name: 'nounId',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'bool',
                name: 'extended',
                type: 'bool',
            },
        ],
        name: 'AuctionBid',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'uint256',
                name: 'nounId',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'startTime',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'endTime',
                type: 'uint256',
            },
        ],
        name: 'AuctionCreated',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'uint256',
                name: 'nounId',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'endTime',
                type: 'uint256',
            },
        ],
        name: 'AuctionExtended',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: 'minBidIncrementPercentage',
                type: 'uint256',
            },
        ],
        name: 'AuctionMinBidIncrementPercentageUpdated',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: 'reservePrice',
                type: 'uint256',
            },
        ],
        name: 'AuctionReservePriceUpdated',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'uint256',
                name: 'nounId',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'winner',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'AuctionSettled',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: 'timeBuffer',
                type: 'uint256',
            },
        ],
        name: 'AuctionTimeBufferUpdated',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'Paused',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'Unpaused',
        type: 'event',
    },
    {
        inputs: [],
        name: 'auction',
        outputs: [
            {
                internalType: 'uint256',
                name: 'nounId',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'startTime',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'endTime',
                type: 'uint256',
            },
            {
                internalType: 'address payable',
                name: 'bidder',
                type: 'address',
            },
            {
                internalType: 'bool',
                name: 'settled',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'nounId',
                type: 'uint256',
            },
        ],
        name: 'createBid',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'duration',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'contract INounsToken',
                name: '_nouns',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_weth',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_timeBuffer',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_reservePrice',
                type: 'uint256',
            },
            {
                internalType: 'uint8',
                name: '_minBidIncrementPercentage',
                type: 'uint8',
            },
            {
                internalType: 'uint256',
                name: '_duration',
                type: 'uint256',
            },
        ],
        name: 'initialize',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'minBidIncrementPercentage',
        outputs: [
            {
                internalType: 'uint8',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'nouns',
        outputs: [
            {
                internalType: 'contract INounsToken',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'pause',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'paused',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'reservePrice',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint8',
                name: '_minBidIncrementPercentage',
                type: 'uint8',
            },
        ],
        name: 'setMinBidIncrementPercentage',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_reservePrice',
                type: 'uint256',
            },
        ],
        name: 'setReservePrice',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_timeBuffer',
                type: 'uint256',
            },
        ],
        name: 'setTimeBuffer',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'settleAuction',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'settleCurrentAndCreateNewAuction',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'timeBuffer',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'unpause',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'weth',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
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

    const [bids, setBids] = useState<
        {
            blockNumber: number
            nounId: number
            sender: string
            value: string
            extended: boolean
            transactionHash: string
        }[]
    >()

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

    async function fetchRecentBids(nounId: number) {
        if (!isConnected) throw Error('User disconnected')

        if (!walletProvider) throw Error('Wallet provider not found')

        const ethersProvider = new BrowserProvider(walletProvider)

        const signer = await ethersProvider.getSigner()

        const nounsContract = new Contract(
            nounsContractAddress,
            nounsContractABI,
            signer
        )

        const currentBlock = await ethersProvider.getBlockNumber()

        const fromBlock = currentBlock - 5780219 // Adjust this value based on your needs

        const filter = nounsContract.filters.AuctionBid(343)

        const events = await nounsContract.queryFilter(
            filter,
            fromBlock,
            currentBlock
        )

        console.log('events', events)

        const bids = events.map((event) => {
            const detailedEvent = event as EventLog

            return {
                blockNumber: detailedEvent.blockNumber,
                nounId: detailedEvent.args.nounId.toString(),
                sender: detailedEvent.args.sender,
                value: formatEther(detailedEvent.args.value), // Convert Wei to Ether
                extended: detailedEvent.args.extended,
                transactionHash: detailedEvent.transactionHash,
            }
        })

        setBids((prev) => prev?.concat(bids) || bids)

        console.log('Recent Bids:', bids)
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
                <>
                    <div>
                        <button
                            onClick={() =>
                                fetchRecentBids(auctionDetails.nounId)
                            }
                        >
                            Fetch Recent Bids
                        </button>
                    </div>

                    {bids && (
                        <ul className="space-y-2">
                            {bids.map((bid, index) => (
                                <li key={index}>
                                    <strong>Block Number:</strong>{' '}
                                    {bid.blockNumber}
                                    <br />
                                    <strong>Noun ID:</strong> {bid.nounId}
                                    <br />
                                    <strong>Sender:</strong> {bid.sender}
                                    <br />
                                    <strong>Value:</strong> {bid.value}
                                    <br />
                                    <strong>Extended:</strong>{' '}
                                    {bid.extended.toString()}
                                    <br />
                                    <strong>Transaction Hash:</strong>{' '}
                                    {bid.transactionHash}
                                    <br />
                                </li>
                            ))}
                        </ul>
                    )}

                    {auctionDetails && (
                        <div>
                            <button
                                onClick={() =>
                                    placeBid(auctionDetails.nounId, '1')
                                }
                            >
                                Place Bid on Noun #{auctionDetails.nounId}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default AuctionDetails
