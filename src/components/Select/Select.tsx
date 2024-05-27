'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import SpacesImage from '@/components/SpacesImage'
import SelectOption from '@/utils/dto/SelectOption'
import styles from '@/utils/styles/select.module.css'
import { Londrina_Solid } from 'next/font/google'
import useOutsideClick from '@/utils/services/useClickOutside'
import { ChevronDownIcon } from '@heroicons/react/24/solid'

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
    label: string
    options: SelectOption[]
    placeholder?: string
    selected?: number | string | null
    updateSelected: (value?: number | string) => void
}

const Select: React.FC<Props> = ({
    disabled,
    label,
    options,
    placeholder = 'Any',
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

    useEffect(() => {
        if (disabled) {
            setOptionsVisible(false)
        }
    }, [disabled])

    function handleSelect(value?: number | string) {
        setOptionsVisible(false)

        updateSelected(value)
    }

    const selectedOption = useMemo(() => {
        return options.find((option) => option.value == selected)
    }, [options, selected])

    return (
        <div
            ref={selectRef}
            className={styles.select}
            data-option-count={options.length}
            data-state={optionsVisible ? 'open' : 'closed'}
        >
            <div className={styles.heading} role="heading">
                <button
                    disabled={disabled}
                    type="button"
                    className={styles.button}
                    onClick={toggleOptions}
                >
                    <label
                        className={`${londrinaSolidBlack.className} ${styles.label}`}
                    >
                        {label}
                    </label>

                    {selected ? (
                        <div className={styles.selected}>
                            {selectedOption?.colorHex && (
                                <div
                                    className="w-[50px] h-[22px] mr-2"
                                    style={{
                                        backgroundColor:
                                            selectedOption?.colorHex,
                                    }}
                                ></div>
                            )}

                            {selectedOption?.imgSrc && (
                                <SpacesImage
                                    src={selectedOption.imgSrc}
                                    className="max-h-[22px] max-w-[32px] mr-2"
                                />
                            )}

                            <span
                                className={`${londrinaSolidNormal.className} truncate`}
                            >
                                {selectedOption
                                    ? selectedOption.label
                                    : selected}
                            </span>
                        </div>
                    ) : (
                        <div
                            className={`${londrinaSolidNormal.className} ${styles.placeholder}`}
                        >
                            {placeholder}
                        </div>
                    )}

                    <div className={styles.iconWrapper}>
                        <ChevronDownIcon className="h-5 w-5" />
                    </div>
                </button>
            </div>

            {optionsVisible && (
                <ul className={styles.options}>
                    <li>
                        <button
                            type="button"
                            className={styles.optionsButton}
                            onClick={() => handleSelect(undefined)}
                        >
                            <span
                                className={`${londrinaSolidNormal.className} text-xl uppercase truncate`}
                            >
                                {placeholder}
                            </span>
                        </button>
                    </li>

                    {options.map((option) => (
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
            )}
        </div>
    )
}

export default Select
