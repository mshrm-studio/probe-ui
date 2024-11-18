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
import styles from '@/utils/styles/searchSelect.module.css'
import SelectValue from '@/utils/dto/SelectValue'
import SpacesImage from '@/components/SpacesImage'

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

    type SelectedOption = SelectOption | null | undefined

    const [selectedOption, setSelectedOption] = useState<SelectedOption>(null)

    useEffect(() => {
        setSelected(selectedOption?.value || null)
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
            const option = options.find((option) => option.value === selected)

            setSelectedOption(option)
        }
    }, [selected])

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
                    {/* <SpacesImage
                        className="h-2"
                        src="misc/chevron-down.png"
                        alt="Chevron Down"
                        aria-hidden="true"
                    />                     */}

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
