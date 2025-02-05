import HeaderIsland from '@/components/Header/Island/Island'
import styles from '@/app/nouns/proposals/create/_styles/header.module.css'

export default function Header() {
    return (
        <header className={styles.header}>
            <HeaderIsland />
        </header>
    )
}
