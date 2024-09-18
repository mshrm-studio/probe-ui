import { createContext } from 'react'
import { Contract } from 'ethers'

// Define the types for the context
interface AuctionHouseContractContext {
    httpAuctionHouseContract?: Contract | null
    wsAuctionHouseContract?: Contract | null
}

// Create the context with default values
const AuctionHouseContractContext = createContext<AuctionHouseContractContext>(
    {}
)

export default AuctionHouseContractContext
