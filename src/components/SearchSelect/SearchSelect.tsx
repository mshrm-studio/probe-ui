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
import { useEffect, useMemo, useState } from 'react'
import styles from '@/styles/searchSelect.module.css'
import SelectValue from '@/utils/dto/SelectValue'

type Props = {
    boxShadowStyle?: 'solid' | 'blurred'
    disabled?: boolean
    label?: string
    options: SelectOption[]
    required?: boolean
    selected: SelectValue
    setSelected: React.Dispatch<React.SetStateAction<SelectValue>>
}

export default function SearchSelect({
    boxShadowStyle = 'solid',
    disabled,
    label,
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
        console.log('*****')
        console.log('SearchSelect.tsx, useEffect[selectedOption]')

        if (selectedOption?.value !== selected) {
            console.log(`setSelected(${selectedOption?.value})`)
            setSelected(selectedOption?.value)
        }
    }, [selectedOption])

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
    }, [query])

    useEffect(() => {
        if (selected) {
            const option = options.find((option) => option.value == selected)

            console.log('*****')
            console.log('SearchSelect.tsx, useEffect[selected]')
            console.log('options', options)

            if (selectedOption !== option) {
                console.log(`setSelectedOption(${option || null})`)

                setSelectedOption(option || null)
            }
        }
    }, [options, selected])

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
                    onBlur={() => setQuery('')}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="None"
                    required={required}
                />
                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center px-4 focus:outline-none">
                    <ChevronDownIcon className="h-5 w-5" />
                </ComboboxButton>

                {filteredOptions.length > 0 && (
                    <ComboboxOptions className={styles.searchSelectOptions}>
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
                                        {option.label}
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
