import styles from '@/utils/styles/header/island/island.module.css'
import SpacesImage from '@/components/SpacesImage'
import HeaderIslandSearch from '@/components/Header/Island/Search'
import HeaderIslandAuth from '@/components/Header/Island/Auth'

export default function HeaderIsland() {
    return (
        <>
            <header className={styles.header}>
                <nav className={styles.nav}>
                    <ul className={styles.list}>
                        <li className={styles.listItem}>
                            <SpacesImage src="header/probe.svg" />
                        </li>

                        <li className={styles.listItem}>
                            <HeaderIslandSearch>
                                <SpacesImage src="header/search.svg" />
                            </HeaderIslandSearch>
                        </li>

                        <li className={styles.listItem}>
                            <HeaderIslandAuth>
                                <SpacesImage src="header/user.svg" />
                            </HeaderIslandAuth>
                        </li>
                    </ul>
                </nav>
            </header>

            <div className={styles.spacer} />
        </>
    )
}
