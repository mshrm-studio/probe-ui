import { createContext, Dispatch, SetStateAction } from 'react'

// Create the context with default values
const ShowExplorePageFiltersContext = createContext<{
    show: boolean
    setShow: Dispatch<SetStateAction<boolean>>
}>({
    show: false,
    setShow: () => {}, // This is a noop function just for initial context value. It will be overridden by the actual useState function provided by the component that provides this context.
})

export default ShowExplorePageFiltersContext
