import { createContext } from 'react'
import { Contract } from 'ethers'

// Define the types for the context
interface DreamContractContext {
    httpDreamContract?: Contract | null
}

// Create the context with default values
const DreamContractContext = createContext<DreamContractContext>({})

export default DreamContractContext
