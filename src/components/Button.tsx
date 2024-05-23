'use client'

import styles from '@/utils/styles/button.module.css'
import { Londrina_Solid } from 'next/font/google'

const londrinaSolid = Londrina_Solid({
    subsets: ['latin'],
    weight: '400',
})

type Props = {
    children: React.ReactNode
    color?: 'yellow'
    disabled?: boolean
    nativeType?: 'button' | 'submit'
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const Button: React.FC<Props> = ({
    children,
    color = 'yellow',
    disabled,
    nativeType = 'button',
    onClick,
}) => {
    return (
        <button
            className={`${styles.button} ${color} ${londrinaSolid.className}`}
            disabled={disabled}
            type={nativeType}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export default Button
