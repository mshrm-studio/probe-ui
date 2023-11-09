'use client'
import React, { useEffect, useRef } from 'react'
import styles from '@/utils/styles/modal.module.css'
import { motion } from 'framer-motion'

type Props = {
    children: React.ReactNode
    onClickOutside: () => void
}

const Modal: React.FC<Props> = ({ children, onClickOutside }) => {
    const modalRef = useRef<HTMLDivElement>(null)

    const handleClickOutside = (event: MouseEvent) => {
        if (
            modalRef.current &&
            !modalRef.current.contains(event.target as Node)
        ) {
            onClickOutside()
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <motion.div
            className={styles.modalWrapper}
            variants={wrapperVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
        >
            <motion.div
                ref={modalRef}
                className={styles.modal}
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
            >
                {children}
            </motion.div>
        </motion.div>
    )
}

export default Modal

const wrapperVariants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            when: 'beforeChildren',
            duration: 0.3,
        },
    },
}

const modalVariants = {
    hidden: {
        y: 50,
        opacity: 0,
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 25,
        },
    },
}
