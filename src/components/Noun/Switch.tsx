'use client'
import { usePathname, useRouter } from 'next/navigation'
import SpacesImage from '@/components/SpacesImage'
import { MouseEventHandler, useEffect, useState } from 'react'
import useHref from '@/utils/services/useHref'
import Link from 'next/link'
import Switch from '@/components/Switch'
import styles from '@/utils/styles/nounSwitch.module.css'

export default function NounSwitch() {
    const { lilsLink, nounsLink } = useHref()
    const pathname = usePathname()
    const router = useRouter()

    const [isOn, setIsOn] = useState(false)

    useEffect(() => {
        router.push(pathname === '/lils' ? nounsLink : lilsLink)
    }, [isOn])

    const switchProject: MouseEventHandler<HTMLButtonElement> = (_e) => {
        setIsOn((value) => !value)
    }

    return (
        <div className="flex items-center space-x-2">
            <Link href={nounsLink}>
                <SpacesImage
                    className={`h-[20px]`}
                    src={
                        pathname === '/nouns'
                            ? 'nouns/glasses-square-red.png'
                            : 'lils/glasses-square-red.png'
                    }
                    alt="Glasses Square Red"
                />
            </Link>

            <div className="relative">
                <Switch
                    className={styles.switch}
                    handleClassName={styles.handle}
                    isOn={isOn}
                    setIsOn={setIsOn}
                />

                <button
                    className={`absolute top-1/2 -translate-y-1/2 left-0 text-[7px] font-bold text-white uppercase -z-1 ${
                        isOn ? 'translate-x-1' : 'translate-x-4'
                    }`}
                    onClick={switchProject}
                >
                    {pathname === '/lils' ? 'Lils' : 'Bigs'}
                </button>
            </div>
        </div>
    )
}
