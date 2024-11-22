'use client'

import ProjectContext from '@/utils/contexts/ProjectContext'
import { kebabCase } from 'lodash'
import { usePathname } from 'next/navigation'

type Props = {
    children: React.ReactNode
}

const ProjectProvider: React.FC<Props> = ({ children }) => {
    const pathname = usePathname()

    const project = pathname.startsWith('/lils') ? 'LilNouns' : 'Nouns'

    return (
        <ProjectContext.Provider
            value={{
                apiBaseUrl: `/${kebabCase(project)}`,
                baseUrl: project === 'LilNouns' ? '/lils' : '/nouns',
                project,
            }}
        >
            {children}
        </ProjectContext.Provider>
    )
}

export default ProjectProvider
