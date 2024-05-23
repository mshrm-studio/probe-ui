'use client'

import React from 'react'
import styles from '@/utils/styles/input.module.css'

type Props = {
    disabled?: boolean
    name: string
    nativeType?: 'number' | 'text'
    min?: number
    placeholder?: string
    step?: string
}

const Input: React.FC<Props> = ({
    disabled,
    name,
    nativeType = 'text',
    min,
    placeholder,
    step,
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
        />
    )
}

export default Input
