import { createContext } from 'react'
import { Contract, JsonRpcProvider } from 'ethers'

// Define the types for the context
interface RpcContext {
    nounsAuctionContract?: Contract | null
    provider?: JsonRpcProvider | null
}

// Create the context with default values
const RpcContext = createContext<RpcContext>({
    nounsAuctionContract: undefined,
    provider: undefined,
})

export default RpcContext
