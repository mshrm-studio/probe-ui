import HeaderIsland from '@/components/Header/Island/Island'
import DreamForm from '@/app/nouns/dreams/create/_components/DreamForm'
import NounTraits from '@/components/NounTraits'
import ProjectProvider from '@/components/Provider/Project'
import styles from '@/app/nouns/dreams/create/_styles/header.module.css'

export default async function Page() {
    return (
        <ProjectProvider>
            <NounTraits project="Nouns">
                <header className={styles.header}>
                    <HeaderIsland />
                </header>

                <main>
                    <DreamForm />
                </main>
            </NounTraits>
        </ProjectProvider>
    )
}
