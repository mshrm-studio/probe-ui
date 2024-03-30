'use client'
import React, { ChangeEvent, useRef, useState } from 'react'
import SpacesImage from '@/components/SpacesImage'
import SelectOption from '@/utils/dto/SelectOption'
import styles from '@/utils/styles/select.module.css'
import { Londrina_Solid } from 'next/font/google'
import useOutsideClick from '@/utils/services/useClickOutside'

const londrinaSolid = Londrina_Solid({
    subsets: ['latin'],
    weight: '900',
})

type Props = {
    label: string
    options: SelectOption[]
    placeholder?: string
    selectedImgSrc?: string
    selected?: number | string | null
    updateSelected: (value: number | string) => void
}

const Select: React.FC<Props> = ({
    label,
    options,
    placeholder = 'Any',
    selectedImgSrc,
    selected,
    updateSelected,
}) => {
    const selectRef = useRef<HTMLDivElement>(null)

    function handleClickOutside() {
        setOptionsVisible(false)
    }

    useOutsideClick(selectRef, handleClickOutside)

    const [optionsVisible, setOptionsVisible] = useState(false)

    function toggleOptions() {
        setOptionsVisible((prev) => !prev)
    }

    function handleSelect(value: number | string) {
        setOptionsVisible(false)

        updateSelected(value)
    }

    return (
        <div
            ref={selectRef}
            className={styles.select}
            data-state={optionsVisible ? 'open' : 'closed'}
        >
            <div className={styles.heading} role="heading">
                <button
                    type="button"
                    className={styles.button}
                    onClick={toggleOptions}
                >
                    <label
                        className={`${londrinaSolid.className} ${styles.label}`}
                    >
                        {label}
                    </label>

                    {selected ? (
                        <div className={styles.selected}>
                            {selectedImgSrc && (
                                <SpacesImage
                                    src={selectedImgSrc}
                                    className="max-h-[22px] max-w-[32px] mr-2"
                                />
                            )}

                            <span
                                className={`${londrinaSolid.className} truncate`}
                            >
                                {selected}
                            </span>
                        </div>
                    ) : (
                        <div
                            className={`${londrinaSolid.className} ${styles.placeholder}`}
                        >
                            {placeholder}
                        </div>
                    )}
                </button>
            </div>

            {optionsVisible && (
                <ul className={styles.options}>
                    {options.map((option) => (
                        <li key={option.value}>
                            <button
                                type="button"
                                className="flex items-center py-1 px-3 w-full"
                                onClick={() => handleSelect(option.value)}
                            >
                                {option.imgSrc && (
                                    <div className="w-[37px]">
                                        <SpacesImage
                                            src={option.imgSrc}
                                            className="max-h-[26px] max-w-[37px] mr-2"
                                        />
                                    </div>
                                )}

                                <span
                                    className={`${londrinaSolid.className} text-xl truncate`}
                                >
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

export default Select
