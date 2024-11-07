'use client'

import ProjectContext from '@/utils/contexts/ProjectContext'
import Project from '@/utils/dto/Project'
import { kebabCase } from 'lodash'

type Props = {
    children: React.ReactNode
    project: Project
}

const ProjectProvider: React.FC<Props> = ({ children, project }) => {
    return (
        <ProjectContext.Provider
            value={{
                baseUrl: `/${kebabCase(project)}`,
                name: project,
            }}
        >
            {children}
        </ProjectContext.Provider>
    )
}

export default ProjectProvider
