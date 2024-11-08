'use client'

import React, { useEffect, useMemo } from 'react'
import { debounce } from 'lodash'
import Project from '@/utils/dto/Project'
import SearchSelect from '@/components/SearchSelect/SearchSelect'
import chroma from 'chroma-js'
import useNounColorList from '@/utils/services/useNounColorList'

type Props = {
    disabled?: boolean
    project: Project
    selected: string | null | undefined
    setSelected: React.Dispatch<
        React.SetStateAction<string | number | null | undefined>
    >
}

const SearchSelectNounColor: React.FC<Props> = ({
    disabled,
    project,
    selected,
    setSelected,
}) => {
    const { fetchNounColorList, nounColorList } = useNounColorList(project)

    useEffect(() => {
        const debouncedFetch = debounce(() => {
            console.log('fetching noun color list')
            fetchNounColorList()
        }, 500)

        debouncedFetch()

        return () => debouncedFetch.cancel()
    }, [])

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
            .map((color) => {
                const canvas = document.createElement('canvas')
                canvas.width = 24
                canvas.height = 24

                const ctx = canvas.getContext('2d')
                if (ctx) {
                    ctx.fillStyle = color.hex
                    ctx.fillRect(0, 0, 24, 24)
                }

                return {
                    ...color,
                    imgSrc: canvas.toDataURL(),
                    label: color.hex,
                    value: color.hex,
                }
            })
            .sort((a, b) => a.hue - b.hue)
    }, [colorListWithHue])

    return (
        <SearchSelect
            disabled={disabled}
            label="Color"
            options={sortedList}
            selected={selected}
            setSelected={setSelected}
        />
    )
}

export default SearchSelectNounColor
