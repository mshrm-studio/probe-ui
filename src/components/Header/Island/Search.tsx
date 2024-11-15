'use client'

import { useRouter } from 'next/navigation'
import { useContext, useEffect, useRef, useState } from 'react'
import SearchSelect from '@/components/SearchSelect/SearchSelect'
import useNounTraitList from '@/utils/hooks/useNounTraitList'
import SearchSelectSelected from '@/utils/dto/SearchSelectSelected'
import styles from '@/utils/styles/header/island/flyOut.module.css'
import useOutsideClick from '@/utils/hooks/useClickOutside'
import ProjectContext from '@/utils/contexts/ProjectContext'
import SpacesImage from '@/components/SpacesImage'

export default function HeaderIslandSearch() {
    const router = useRouter()

    const [showSearch, setShowSearch] = useState(false)

    const { traitListOptions } = useNounTraitList()

    const [selected, setSelected] = useState<SearchSelectSelected>('')

    const { baseUrl } = useContext(ProjectContext)

    useEffect(() => {
        if (selected) {
            router.push(`${baseUrl}?search=${selected}`)
        }
    }, [baseUrl, selected])

    const searchRef = useRef<HTMLDivElement>(null)

    useOutsideClick(searchRef, () => setShowSearch(false))

    return (
        <div ref={searchRef}>
            <button onClick={() => setShowSearch((value) => !value)}>
                <SpacesImage src="header/search.svg" />
            </button>

            {showSearch && (
                <div className={`${styles.flyOut} ${styles.search}`}>
                    <SearchSelect
                        boxShadowStyle="blurred"
                        label="Search"
                        options={traitListOptions}
                        selected={selected}
                        setSelected={setSelected}
                    />
                </div>
            )}
        </div>
    )
}
