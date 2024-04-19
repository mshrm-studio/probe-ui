'use client'

import React, { useEffect, useMemo } from 'react'
import useNounColorList from '@/utils/services/useNounColorList'
import { debounce } from 'lodash'
import Project from '@/utils/dto/Project'
import Select from '@/components/Select/Select'

type Props = {
    disabled?: boolean
    project: Project
    selected?: string | null
    updateSelected: (e: {
        target: { name: string; value?: string | null }
    }) => void
}

const SelectNounColor: React.FC<Props> = ({
    disabled,
    project,
    selected,
    updateSelected,
}) => {
    const { fetchNounColorList, nounColorList } = useNounColorList(project)

    useEffect(() => {
        const debouncedFetch = debounce(() => {
            fetchNounColorList()
        }, 500)

        debouncedFetch()

        return () => debouncedFetch.cancel()
    }, [])

    function handleSelect(value?: number | string | null) {
        if (typeof value === 'string' || value === undefined) {
            updateSelected({ target: { name: 'color', value } })
        }
    }

    const filteredList = useMemo(() => {
        return nounColorList
            ? nounColorList
                  .map((item) => ({
                      colorHex: item,
                      label: item,
                      value: item,
                  }))
                  .sort((a, b) => a.label.localeCompare(b.label))
            : []
    }, [nounColorList])

    return (
        <Select
            disabled={disabled}
            label="Color"
            options={filteredList}
            selected={selected}
            updateSelected={handleSelect}
        />
    )
}

export default SelectNounColor
