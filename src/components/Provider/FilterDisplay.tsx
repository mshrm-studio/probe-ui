'use client'

import FilterDisplayContext from '@/utils/contexts/FilterDisplayContext'
import { useState } from 'react'

type Props = {
    children: React.ReactNode
}

const ProjectProvider: React.FC<Props> = ({ children }) => {
    const [show, setShow] = useState(false)

    return (
        <FilterDisplayContext.Provider value={{ show, setShow }}>
            {children}
        </FilterDisplayContext.Provider>
    )
}

export default ProjectProvider
