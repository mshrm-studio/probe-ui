import { createContext, Dispatch, SetStateAction } from 'react'

const FilterDisplayContext = createContext<{
    show: boolean
    setShow: Dispatch<SetStateAction<boolean>>
}>({
    show: false,
    setShow: () => false,
})

export default FilterDisplayContext
