'use client'

import React, { useState } from 'react'
import ShowExplorePageFiltersContext from '@/utils/contexts/ShowExplorePageFiltersContext'

const ShowExplorePageFiltersProvider: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    const [show, setShow] = useState<boolean>(false)

    return (
        <ShowExplorePageFiltersContext.Provider value={{ show, setShow }}>
            {children}
        </ShowExplorePageFiltersContext.Provider>
    )
}

export default ShowExplorePageFiltersProvider
