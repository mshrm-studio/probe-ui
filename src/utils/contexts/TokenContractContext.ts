import { createContext } from 'react'
import { Contract } from 'ethers'

// Define the types for the context
interface TokenContractContext {
    httpTokenContract?: Contract | null
}

// Create the context with default values
const TokenContractContext = createContext<TokenContractContext>({})

export default TokenContractContext
