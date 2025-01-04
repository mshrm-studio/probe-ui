'use client'

import { useContext, useEffect, useMemo } from 'react'
import { debounce } from 'lodash'
import Select from '@/components/Select/Select'
import ProjectContext from '@/utils/contexts/ProjectContext'
import useNounSettlerList from '@/utils/hooks/useNounSettlerList'

type Props = {
    disabled?: boolean
    selected: string | null | undefined
    setSelected: (value: string | undefined) => void
}

const SelectNounColor: React.FC<Props> = ({
    disabled,
    selected,
    setSelected,
}) => {
    const { project } = useContext(ProjectContext)
    const { fetchNounSettlerList, nounSettlerList } =
        useNounSettlerList(project)

    useEffect(() => {
        const debouncedFetch = debounce(() => {
            fetchNounSettlerList()
        }, 300)

        debouncedFetch()

        return () => debouncedFetch.cancel()
    }, [])

    const options = useMemo(() => {
        return nounSettlerList
            ? nounSettlerList.map((settler) => ({
                  label: settler,
                  value: settler,
              }))
            : []
    }, [nounSettlerList])

    return (
        <Select
            disabled={disabled}
            label="Settler"
            options={options}
            selected={selected}
            setSelected={(settler) => {
                setSelected(typeof settler === 'string' ? settler : undefined)
            }}
        />
    )
}

export default SelectNounColor
