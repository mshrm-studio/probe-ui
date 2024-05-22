import { createContext } from 'react'
import Auction from '@/utils/dto/Auction'

// Define the types for the context
interface AuctionContext {
    auction?: Auction | null
    reservePrice?: number | null
    minBidIncrementPercentage?: number | null
    fetchAuctionDetails?: () => Promise<void>
}

// Create the context with default values
const AuctionContext = createContext<AuctionContext>({})

export default AuctionContext
