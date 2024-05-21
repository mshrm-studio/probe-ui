import { createContext } from 'react'
import { Contract, ContractTransaction } from 'ethers'

// Define the types for the context
interface RpcContext {
    nounsAuctionContract?: Contract | null
}

// Create the context with default values
const RpcContext = createContext<RpcContext>({
    nounsAuctionContract: undefined,
})

export default RpcContext
