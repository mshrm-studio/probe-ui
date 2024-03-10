// DimensionsProvider.js
import React, { useState, useEffect } from 'react'
import DimensionsContext, {
    Dimensions,
} from '@/utils/contexts/DimensionsContext'

const DimensionsProvider: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    const [dimensions, setDimensions] = useState<Dimensions>({
        viewportHeight: window.innerHeight,
        viewportWidth: window.innerWidth,
        headerHeight: 0,
        viewportOrientation: 'Portrait',
    })

    // Function to update dimensions
    const updateDimensions = () => {
        setDimensions({
            viewportHeight: window.innerHeight,
            viewportWidth: window.innerWidth,
            headerHeight: document.querySelector('header')?.offsetHeight || 0,
            viewportOrientation:
                window.innerHeight > window.innerWidth
                    ? 'Portrait'
                    : 'Landscape',
        })
    }

    useEffect(() => {
        window.addEventListener('resize', updateDimensions)

        updateDimensions()

        return () => window.removeEventListener('resize', updateDimensions)
    }, [])

    return (
        <DimensionsContext.Provider value={{ dimensions, setDimensions }}>
            {children}
        </DimensionsContext.Provider>
    )
}

export default DimensionsProvider
