'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import SearchSelect from '@/components/SearchSelect/SearchSelect'
import useNounTraitList from '@/utils/hooks/useNounTraitList'
import SelectValue from '@/utils/dto/SelectValue'
import styles from '@/styles/header/island/flyOut.module.css'
import useOutsideClick from '@/utils/hooks/useClickOutside'
import SpacesImage from '@/components/SpacesImage'
import { startCase } from 'lodash'

export default function HeaderIslandSearch({
    className,
}: {
    className: string
}) {
    const router = useRouter()
    const { traitList } = useNounTraitList()
    const [showSearch, setShowSearch] = useState(false)

    const options = useMemo(() => {
        return traitList.map((trait) => ({
            ...trait,
            imgSrc: trait.svg_url,
            label:
                trait.layer === 'background'
                    ? trait.name.toLowerCase() === 'd5d7e1'
                        ? 'cool'
                        : 'warm'
                    : startCase(
                          trait.name.replace(new RegExp(`^${trait.layer}-`), '')
                      ),
            value: trait.name,
        }))
    }, [traitList])

    const [selected, setSelected] = useState<SelectValue>('')

    const pathname = usePathname()

    useEffect(() => {
        const query = new URLSearchParams(window.location.search)

        if (selected) {
            query.set('search', String(selected))
        } else {
            query.delete('search')
        }

        router.replace(`?${query.toString()}`)
    }, [selected])

    const handleClick = () => {
        const searchablePaths = ['/nouns', '/nouns/dreams', '/lils']

        if (searchablePaths.includes(pathname)) {
            setShowSearch((value) => !value)
        } else {
            const redirectMap: Record<string, string> = {
                '/nouns/dreams/create-v2': '/nouns/dreams',
                '/nouns/dreams/create': '/nouns/dreams',
                '/nouns/dreams/[id]': '/nouns/dreams',
                '/nouns/[id]': '/nouns',
            }

            router.push(redirectMap[pathname] || '/nouns')
        }
    }

    const searchRef = useRef<HTMLDivElement>(null)

    useOutsideClick(searchRef, () => setShowSearch(false))

    return (
        <li className={className}>
            <div ref={searchRef}>
                <button onClick={handleClick}>
                    <SpacesImage src="header/search.svg" />
                </button>

                {showSearch && (
                    <div className={`${styles.flyOut} ${styles.search}`}>
                        <SearchSelect
                            boxShadowStyle="blurred"
                            label="Search"
                            options={options}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    </div>
                )}
            </div>
        </li>
    )
}
