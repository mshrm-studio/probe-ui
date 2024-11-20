import { useContext, useMemo } from 'react'
import NounTraitsContext from '@/utils/contexts/NounTraitsContext'

const useNounTraitList = () => {
    const { accessoryList, backgroundList, bodyList, glassesList, headList } =
        useContext(NounTraitsContext)

    const traitList = useMemo(
        () => [
            ...accessoryList,
            ...backgroundList,
            ...bodyList,
            ...glassesList,
            ...headList,
        ],
        [accessoryList, backgroundList, bodyList, glassesList, headList]
    )

    return {
        accessoryList,
        backgroundList,
        bodyList,
        glassesList,
        headList,
        traitList,
    }
}

export default useNounTraitList
