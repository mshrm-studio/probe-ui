'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import SpacesImage from '@/components/SpacesImage'
import SelectOption from '@/utils/dto/SelectOption'
import styles from '@/utils/styles/searchSelect.module.css'
import { Londrina_Solid } from 'next/font/google'
import useOutsideClick from '@/utils/services/useClickOutside'
import Input from '@/components/Input/Input'

const londrinaSolidBlack = Londrina_Solid({
    subsets: ['latin'],
    weight: '900',
})

const londrinaSolidNormal = Londrina_Solid({
    subsets: ['latin'],
    weight: '400',
})

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
    const [search, setSearch] = useState('')

    function handleSelect(value?: number | string) {
        updateSelected(value)
    }

    const searchFilteredOptions = useMemo(() => {
        return options.filter((option) => {
            return option.label.toLowerCase().includes(search.toLowerCase())
        })
    }, [options, search])

    return (
        <div className={styles.searchSelect} data-option-count={options.length}>
            <div className={styles.heading} role="heading">
                <Input
                    disabled={disabled}
                    name="search"
                    placeholder={placeholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <ul className={styles.options}>
                {searchFilteredOptions.map((option) => (
                    <li key={option.value}>
                        <button
                            type="button"
                            className={styles.optionsButton}
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

                            <span
                                className={`${londrinaSolidNormal.className} text-xl uppercase truncate`}
                            >
                                {option.label}
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default SearchSelect
