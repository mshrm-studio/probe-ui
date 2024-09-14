'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import SpacesImage from '@/components/SpacesImage'
import SelectOption from '@/utils/dto/SelectOption'
import styles from '@/utils/styles/searchSelect.module.css'
import Input from '@/components/Input/Input'

type Props = {
    disabled?: boolean
    options: SelectOption[]
    placeholder?: string
    selected?: number | string
    updateSelected: (value?: number | string) => void
}

const SearchSelect: React.FC<Props> = ({
    disabled,
    options,
    placeholder = 'Search',
    selected,
    updateSelected,
}) => {
    const [search, setSearch] = useState(selected ? String(selected) : '')
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const optionsContainerRef = useRef<HTMLUListElement>(null)
    const optionRefs = useRef<(HTMLLIElement | null)[]>([])

    useEffect(() => {
        setSearch(selected ? String(selected) : '')
    }, [selected])

    function handleSelect(value?: number | string) {
        updateSelected(value)
    }

    const searchFilteredOptions = useMemo(() => {
        return options.filter((option) => {
            return option.label.toLowerCase().startsWith(search.toLowerCase())
        })
    }, [options, search])

    function clearSelected() {
        updateSelected(undefined)
    }

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'ArrowDown') {
                setHoveredIndex((prevIndex) =>
                    prevIndex === null ||
                    prevIndex === searchFilteredOptions.length - 1
                        ? 0
                        : prevIndex + 1
                )
            } else if (event.key === 'ArrowUp') {
                setHoveredIndex((prevIndex) =>
                    prevIndex === null || prevIndex === 0
                        ? searchFilteredOptions.length - 1
                        : prevIndex - 1
                )
            } else if (
                event.key === 'Enter' &&
                hoveredIndex !== null &&
                !disabled
            ) {
                handleSelect(searchFilteredOptions[hoveredIndex].value)
            }
        },
        [searchFilteredOptions, hoveredIndex]
    )

    useEffect(() => {
        if (hoveredIndex !== null && optionRefs.current[hoveredIndex]) {
            optionRefs.current[hoveredIndex]?.scrollIntoView({
                block: 'nearest',
                inline: 'nearest',
            })
        }
    }, [hoveredIndex])

    useEffect(() => {
        setHoveredIndex(null)
    }, [search])

    return (
        <div className={styles.searchSelect} data-option-count={options.length}>
            <div className={styles.heading} role="heading">
                <Input
                    autocomplete="off"
                    disabled={disabled}
                    name="search"
                    placeholder={placeholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                {selected && (
                    <div className="text-sm text-center">
                        <button
                            type="button"
                            className="text-link"
                            onClick={clearSelected}
                        >
                            Clear
                        </button>
                    </div>
                )}
            </div>

            {searchFilteredOptions.length === 0 ? (
                <div className={`${styles.noOptions} text-xl`}>
                    No matches for "{search}"
                </div>
            ) : (
                <ul ref={optionsContainerRef} className={styles.options}>
                    {searchFilteredOptions.map((option, index) => (
                        <li
                            key={option.value}
                            ref={(el) => (optionRefs.current[index] = el)}
                        >
                            <button
                                disabled={disabled}
                                type="button"
                                className={styles.optionsButton}
                                data-hovered={
                                    hoveredIndex === index ? 'true' : 'false'
                                }
                                onClick={() => handleSelect(option.value)}
                            >
                                {option.colorHex && (
                                    <div
                                        className="w-[50px] h-[22px] mr-2"
                                        style={{
                                            backgroundColor: option.colorHex,
                                        }}
                                    ></div>
                                )}

                                {option.imgSrc && (
                                    <div className="w-[37px]">
                                        <SpacesImage
                                            src={option.imgSrc}
                                            className="max-h-[26px] max-w-[37px] mr-2"
                                        />
                                    </div>
                                )}

                                <span className="text-xl truncate">
                                    {option.label}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default SearchSelect
