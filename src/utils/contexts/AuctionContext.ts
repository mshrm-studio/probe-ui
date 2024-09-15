import { createContext } from 'react'
import Auction from '@/utils/dto/Auction'

// Define the types for the context
interface AuctionContext {
    auction?: Auction
    reservePrice?: number
    minBidIncrementPercentage?: number
    fetchAuctionDetails?: () => Promise<void>
    setAuction?: React.Dispatch<React.SetStateAction<Auction | undefined>>
}

// Create the context with default values
const AuctionContext = createContext<AuctionContext>({})

export default AuctionContext
