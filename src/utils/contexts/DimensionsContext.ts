import { createContext, Dispatch, SetStateAction } from 'react'

// Define the shape of the dimensions object
export interface Dimensions {
    headerHeight: number
    viewportHeight: number
    viewportWidth: number
    viewportOrientation: 'Portrait' | 'Landscape'
}

// Create the context with default values
const DimensionsContext = createContext<{
    dimensions: Dimensions
    setDimensions: Dispatch<SetStateAction<Dimensions>>
}>({
    dimensions: {
        headerHeight: 0,
        viewportHeight: 0,
        viewportWidth: 0,
        viewportOrientation: 'Portrait',
    },
    setDimensions: () => {}, // This is a noop function just for initial context value. It will be overridden by the actual useState function provided by the component that provides this context.
})

export default DimensionsContext
