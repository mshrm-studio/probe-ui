'use client'

import React from 'react'
import styles from '@/styles/input/input.module.css'

type Props = {
    autocomplete?: 'off'
    defaultValue?: string | number
    disabled?: boolean
    name: string
    nativeType?: 'number' | 'text'
    min?: number
    placeholder?: string
    step?: string
    value?: string | number
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

const Input: React.FC<Props> = ({
    autocomplete,
    defaultValue,
    disabled,
    name,
    nativeType = 'text',
    min,
    placeholder,
    step,
    value,
    onChange,
    onKeyDown,
}) => {
    return (
        <input
            autoComplete={autocomplete}
            type={nativeType}
            name={name}
            disabled={disabled}
            className={styles.input}
            placeholder={placeholder}
            min={min}
            step={step}
            defaultValue={defaultValue}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
        />
    )
}

export default Input
