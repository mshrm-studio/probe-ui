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
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'
import styles from '@/utils/styles/searchSelect.module.css'
import SearchSelectSelected from '@/utils/dto/SearchSelectSelected'

type Props = {
    boxShadowStyle?: 'solid' | 'blurred'
    disabled?: boolean
    label?: string
    options: SelectOption[]
    selected?: string | number | null
    setSelected: React.Dispatch<React.SetStateAction<SearchSelectSelected>>
}

export default function SearchSelect({
    boxShadowStyle = 'solid',
    disabled,
    label,
    options,
    selected,
    setSelected,
}: Props) {
    const [query, setQuery] = useState('')

    type SelectedOption = SelectOption | null | undefined

    const [selectedOption, setSelectedOption] = useState<SelectedOption>(null)

    useEffect(() => {
        setSelected(selectedOption?.value || null)
    }, [selectedOption])

    const filteredOptions =
        query === ''
            ? options
            : options.filter((option) => {
                  return option.label
                      .toLowerCase()
                      .includes(query.toLowerCase())
              })

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
                    onChange={(event) => {
                        setQuery(event.target.value)
                    }}
                    onBlur={() => setQuery('')}
                    displayValue={(option) =>
                        typeof option === 'object' &&
                        option &&
                        'label' in option &&
                        typeof option.label === 'string'
                            ? option.label
                            : ''
                    }
                    placeholder="None"
                />
                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center px-2 focus:outline-none">
                    <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
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
