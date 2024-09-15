import { createContext } from 'react'
import { Contract, JsonRpcProvider, WebSocketProvider } from 'ethers'

// Define the types for the context
interface RpcContext {
    httpNounsAuctionHouseContract?: Contract | null
    httpNounsTokenContract?: Contract | null
    httpProvider?: JsonRpcProvider | null
    wsNounsAuctionHouseContract?: Contract | null
    wsProvider?: WebSocketProvider | null
}

// Create the context with default values
const RpcContext = createContext<RpcContext>({})

export default RpcContext
