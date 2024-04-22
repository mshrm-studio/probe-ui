import { createContext, Dispatch, SetStateAction } from 'react'

// Create the context with default values
const RequestingContext = createContext<{
    requesting: boolean
    setRequesting: Dispatch<SetStateAction<boolean>>
}>({
    requesting: false,
    setRequesting: () => {}, // This is a noop function just for initial context value. It will be overridden by the actual useState function provided by the component that provides this context.
})

export default RequestingContext
