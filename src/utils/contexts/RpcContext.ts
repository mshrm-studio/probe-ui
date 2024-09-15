import { createContext } from 'react'
import { Contract, JsonRpcProvider } from 'ethers'

// Define the types for the context
interface RpcContext {
    httpNounsAuctionContract?: Contract | null
    httpProvider?: JsonRpcProvider | null
    wsNounsAuctionContract?: Contract | null
    wsProvider?: JsonRpcProvider | null
}

// Create the context with default values
const RpcContext = createContext<RpcContext>({
    httpNounsAuctionContract: undefined,
    httpProvider: undefined,
    wsNounsAuctionContract: undefined,
    wsProvider: undefined,
})

export default RpcContext
