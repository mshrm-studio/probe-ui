import { createContext } from 'react'

// Define the types for the context
interface NounSettlementContext {
    amount?: string
    blockTimestamp?: number
    clientId?: number
    nounId?: number
    winner?: string
}

// Create the context with default values
const NounSettlementContext = createContext<NounSettlementContext>({})

export default NounSettlementContext
