'use client'

import SelectOption from '@/utils/dto/SelectOption'
import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
    Label,
} from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styles from '@/styles/searchSelect.module.css'
import SelectValue from '@/utils/dto/SelectValue'
import EthAddress from '@/components/EthAddress'

type Props = {
    boxShadowStyle?: 'solid' | 'blurred'
    disabled?: boolean
    label?: string
    optionlabelIsEthAddress?: boolean
    options: SelectOption[]
    required?: boolean
    selected: SelectValue
    setSelected: React.Dispatch<React.SetStateAction<SelectValue>>
}

export default function SearchSelect({
    boxShadowStyle = 'solid',
    disabled,
    label,
    optionlabelIsEthAddress,
    options,
    required,
    selected,
    setSelected,
}: Props) {
    const [query, setQuery] = useState('')

    type SelectedOption = SelectOption | null

    const [selectedOption, setSelectedOption] = useState<SelectedOption>(
        options.find((option) => option.value == selected) || null
    )

    useEffect(() => {
        setSelectedOption(
            options.find((option) => option.value == selected) || null
        )
    }, [selected])

    const filteredOptions = useMemo(() => {
        if (query === '') return options

        const optionsStartingWithQuery = options.filter((option) =>
            option.label.toLowerCase().startsWith(query.toLowerCase())
        )

        const optionsIncludingQuery = options.filter(
            (option) =>
                option.label.toLowerCase().includes(query.toLowerCase()) &&
                !optionsStartingWithQuery.includes(option)
        )

        return [...optionsStartingWithQuery, ...optionsIncludingQuery]
    }, [options, query])

    const optionsRef = useRef<HTMLDivElement>(null)

    const calculateMaxHeight = useCallback(() => {
        if (!optionsRef.current) return
        const rect = optionsRef.current.getBoundingClientRect()
        const availableHeight = window.innerHeight - rect.top - 16 // 16px for margin
        optionsRef.current.style.setProperty(
            '--dropdown-max-height',
            `${availableHeight}px`
        )
    }, [optionsRef])

    return (
        <Combobox
            as="div"
            className={`${styles.searchSelectWrapper} ${
                boxShadowStyle === 'blurred'
                    ? styles.blurredBoxShadow
                    : styles.solidBoxShadow
            }`}
            immediate
            value={selectedOption}
            onChange={(option) => {
                setQuery('')
                setSelectedOption(option)
                setSelected(option?.value)
            }}
        >
            <div className="relative">
                {label && (
                    <Label className={styles.searchSelectLabel}>{label}</Label>
                )}

                <ComboboxInput
                    className={styles.searchSelectInput}
                    disabled={disabled}
                    displayValue={(option) =>
                        typeof option === 'object' &&
                        option &&
                        'label' in option &&
                        typeof option.label === 'string'
                            ? option.label
                            : ''
                    }
                    onFocus={() => setTimeout(() => calculateMaxHeight(), 50)}
                    onBlur={() => setQuery('')}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="None"
                    required={required}
                />

                <ComboboxButton
                    className="absolute inset-y-0 right-0 flex items-center px-4 focus:outline-none"
                    onClick={() => setTimeout(() => calculateMaxHeight(), 50)}
                >
                    <ChevronDownIcon className="h-5 w-5" />
                </ComboboxButton>

                {filteredOptions.length > 0 && (
                    <ComboboxOptions
                        ref={optionsRef}
                        className={styles.searchSelectOptions}
                    >
                        {filteredOptions.map((option) => (
                            <ComboboxOption
                                key={option.value}
                                value={option}
                                className={styles.searchSelectOption}
                            >
                                <div className="flex items-center">
                                    {option.imgSrc && (
                                        <img
                                            src={option.imgSrc}
                                            alt={option.label}
                                            className={
                                                styles.searchSelectOptionImg
                                            }
                                        />
                                    )}

                                    <span className="ml-3 truncate">
                                        {optionlabelIsEthAddress ? (
                                            <EthAddress
                                                address={option.label}
                                            />
                                        ) : (
                                            option.label
                                        )}
                                    </span>
                                </div>
                            </ComboboxOption>
                        ))}
                    </ComboboxOptions>
                )}
            </div>
        </Combobox>
    )
}
