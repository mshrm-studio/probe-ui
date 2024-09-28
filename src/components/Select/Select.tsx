'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import SpacesImage from '@/components/SpacesImage'
import SelectOption from '@/utils/dto/SelectOption'
import styles from '@/utils/styles/select.module.css'
import useOutsideClick from '@/utils/services/useClickOutside'
import { ChevronDownIcon } from '@heroicons/react/24/solid'

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

    const optionsRefs = useRef<(HTMLLIElement | null)[]>([])

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (!optionsVisible || disabled) return

            const pressedKey = event.key.toLowerCase()

            // Find the index of the first option whose label starts with the pressed letter
            const matchingIndex = options.findIndex((option) =>
                option.label.toLowerCase().startsWith(pressedKey)
            )

            // If a matching option is found, scroll to it
            if (matchingIndex !== -1 && optionsRefs.current[matchingIndex]) {
                optionsRefs.current[matchingIndex]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                })
            }
        }

        // Only add the event listener when options are visible
        if (optionsVisible) {
            window.addEventListener('keydown', handleKeyDown)
        }

        // Clean up the event listener when the options dropdown is closed
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [optionsVisible, disabled, options])

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
                    <label className={styles.label}>{label}</label>

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

                            <span className="truncate">
                                {selectedOption
                                    ? selectedOption.label
                                    : selected}
                            </span>
                        </div>
                    ) : (
                        <div className={styles.placeholder}>{placeholder}</div>
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
                            <span className="text-xl truncate">
                                {placeholder}
                            </span>
                        </button>
                    </li>

                    {options.map((option, index) => (
                        <li
                            key={option.value}
                            ref={(el) => (optionsRefs.current[index] = el)}
                        >
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

export default Select
