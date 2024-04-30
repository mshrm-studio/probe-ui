'use client'

import React, { useEffect, useMemo } from 'react'
import useNounColorList from '@/utils/services/useNounColorList'
import { debounce } from 'lodash'
import Project from '@/utils/dto/Project'
import Select from '@/components/Select/Select'
import chroma from 'chroma-js'

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

    const colorListWithHue = useMemo(() => {
        return nounColorList
            ? nounColorList.map((color) => ({
                  hex: color,
                  hue: chroma(color).get('hsl.h'),
              }))
            : []
    }, [nounColorList])

    const sortedList = useMemo(() => {
        return colorListWithHue
            .map((color) => ({
                colorHex: color.hex,
                hue: color.hue,
                label: color.hex,
                value: color.hex,
            }))
            .sort((a, b) => a.hue - b.hue)
    }, [colorListWithHue])

    return (
        <Select
            disabled={disabled}
            label="Color"
            options={sortedList}
            selected={selected}
            updateSelected={handleSelect}
        />
    )
}

export default SelectNounColor
