import { createContext } from 'react'
import { JsonRpcProvider, WebSocketProvider } from 'ethers'

// Define the types for the context
interface RpcContext {
    httpProvider?: JsonRpcProvider | null
    wsProvider?: WebSocketProvider | null
}

// Create the context with default values
const RpcContext = createContext<RpcContext>({})

export default RpcContext
