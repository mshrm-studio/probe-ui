import { createContext, Dispatch, SetStateAction } from 'react'
import NounTrait from '@/utils/dto/NounTrait'

// Create the context with default values
const NounTraitsContext = createContext<{
    accessoryList: NounTrait[]
    backgroundList: NounTrait[]
    bodyList: NounTrait[]
    glassesList: NounTrait[]
    headList: NounTrait[]
}>({
    accessoryList: [],
    backgroundList: [],
    bodyList: [],
    glassesList: [],
    headList: [],
})

export default NounTraitsContext
