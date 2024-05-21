import { createContext } from 'react'
import Auction from '@/utils/dto/Auction'

// Define the types for the context
interface AuctionContext {
    auction?: Auction | null
}

// Create the context with default values
const AuctionContext = createContext<AuctionContext>({
    auction: undefined,
})

export default AuctionContext
