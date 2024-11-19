import { createContext } from 'react'
import Project from '@/utils/dto/Project'

const ProjectContext = createContext<{
    apiBaseUrl: string
    baseUrl: string
    project: Project
}>({
    apiBaseUrl: '/nouns',
    baseUrl: '/nouns',
    project: 'Nouns',
})

export default ProjectContext
