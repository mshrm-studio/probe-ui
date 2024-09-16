import { createContext } from 'react'

// Define the types for the context
interface NounMintContext {
    blockHash?: string
    blockNumber?: number
    blockTimestamp?: number
}

// Create the context with default values
const NounMintContext = createContext<NounMintContext>({})

export default NounMintContext
