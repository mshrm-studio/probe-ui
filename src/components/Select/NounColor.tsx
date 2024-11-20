'use client'

import { useContext, useEffect, useMemo, useState } from 'react'
import { debounce } from 'lodash'
import SearchSelect from '@/components/SearchSelect/SearchSelect'
import chroma from 'chroma-js'
import useNounColorList from '@/utils/hooks/useNounColorList'
import Select from '@/components/Select/Select'
import ProjectContext from '@/utils/contexts/ProjectContext'

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
    const { fetchNounColorList, nounColorList } = useNounColorList(project)

    useEffect(() => {
        const debouncedFetch = debounce(() => {
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

    const [selectedColor, setSelectedColor] = useState<
        string | number | null | undefined
    >(selected)

    useEffect(() => {
        setSelectedColor(selected)
    }, [selected])

    useEffect(() => {
        setSelected(
            typeof selectedColor === 'string' ? selectedColor : undefined
        )
    }, [selectedColor])

    return (
        <Select
            disabled={disabled}
            label="Color"
            options={sortedList}
            selected={selected}
            setSelected={setSelectedColor}
        />
    )
}

export default SelectNounColor
