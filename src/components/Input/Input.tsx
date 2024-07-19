'use client'

import React from 'react'
import styles from '@/utils/styles/input.module.css'

type Props = {
    defaultValue?: string | number
    disabled?: boolean
    name: string
    nativeType?: 'number' | 'text'
    min?: number
    placeholder?: string
    step?: string
    value?: string | number
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Input: React.FC<Props> = ({
    defaultValue,
    disabled,
    name,
    nativeType = 'text',
    min,
    placeholder,
    step,
    value,
    onChange,
}) => {
    return (
        <input
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
        />
    )
}

export default Input
