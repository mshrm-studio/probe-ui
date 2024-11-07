import { createContext } from 'react'
import Project from '@/utils/dto/Project'

// Create the context with default values
const ProjectContext = createContext<{ name: Project; baseUrl: string }>({
    name: 'Nouns',
    baseUrl: '/nouns',
})

export default ProjectContext
