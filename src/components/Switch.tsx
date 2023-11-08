'use client'
import { motion } from 'framer-motion'
import React from 'react'

type Props = {
    className?: string
    handleClassName?: string
    isOn: boolean
    setIsOn: React.Dispatch<React.SetStateAction<boolean>>
}

const Switch: React.FC<Props> = ({
    className,
    handleClassName,
    isOn,
    setIsOn,
}) => {
    const toggleSwitch = () => setIsOn(!isOn)

    return (
        <div className={className} data-isOn={isOn} onClick={toggleSwitch}>
            <motion.div
                className={handleClassName}
                layout
                transition={spring}
            />
        </div>
    )
}

const spring = {
    type: 'spring',
    stiffness: 700,
    damping: 30,
}

export default Switch
