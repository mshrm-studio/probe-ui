import { createContext } from 'react'
import { Contract } from 'ethers'

// Define the types for the context
interface DataProxyContractContext {
    httpDataProxyContract?: Contract | null
    wsDataProxyContract?: Contract | null
}

// Create the context with default values
const DataProxyContractContext = createContext<DataProxyContractContext>({})

export default DataProxyContractContext
