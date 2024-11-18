import HeaderIsland from '@/components/Header/Island/Island'
import styles from '@/app/nouns/dreams/_styles/header.module.css'
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs'
import SpacesImage from '@/components/SpacesImage'

export default function Header() {
    return (
        <header className={styles.header}>
            <div className="hidden xl:block">
                <Breadcrumbs
                    breadcrumbs={[
                        { label: 'Probe', href: '/' },
                        { label: 'Nouns', href: '/nouns' },
                        { label: 'Dreams', href: '/nouns/dreams' },
                    ]}
                />
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
