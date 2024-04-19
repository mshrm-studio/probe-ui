'use client'

import React, { useState } from 'react'
import RequestingContext from '@/utils/contexts/RequestingContext'

const RequestingProvider: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    const [requesting, setRequesting] = useState<boolean>(false)

    return (
        <RequestingContext.Provider value={{ requesting, setRequesting }}>
            {children}
        </RequestingContext.Provider>
    )
}

export default RequestingProvider
