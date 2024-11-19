import HeaderIsland from '@/components/Header/Island/Island'
import styles from '@/app/nouns-new/_styles/header.module.css'
import Breadcrumbs from '@/app/nouns-new/_components/Header/Breadcrumbs'
import SpacesImage from '@/components/SpacesImage'

export default async function Header() {
    return (
        <header className={styles.header}>
            <div className="hidden xl:block">
                <Breadcrumbs />
            </div>

            <HeaderIsland />

            <div className="hidden xl:block">
                <SpacesImage
                    className="ml-auto mr-0"
                    src="header/noun-glasses.png"
                    alt="Noun Glasses"
                />
            </div>
        </header>
    )
}
