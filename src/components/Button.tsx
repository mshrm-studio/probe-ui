'use client'

import styles from '@/styles/button.module.css'

type Props = {
    children: React.ReactNode
    color?: 'yellow' | 'white'
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
            className={`${styles.button} ${color}`}
            disabled={disabled}
            type={nativeType}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export default Button
