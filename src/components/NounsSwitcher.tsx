'use client'
import { usePathname, useRouter } from 'next/navigation'
import SpacesImage from '@/components/SpacesImage'
import { MouseEventHandler } from 'react'
import useHref from '@/utils/services/useHref'
import Link from 'next/link'

export default function NounSwitcher() {
    const { lilsLink, nounsLink } = useHref()
    const pathname = usePathname()
    const router = useRouter()

    const switchProject: MouseEventHandler<HTMLButtonElement> = (_e) => {
        router.push(pathname === '/lils' ? nounsLink : lilsLink)
    }

    return (
        <div
            className="flex items-center space-x-2 rounded-[9px] p-4"
            style={{ boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)' }}
        >
            <Link href={nounsLink}>
                <SpacesImage
                    className={`h-[29px] ${
                        pathname === '/nouns' ? 'opacity-100' : 'opacity-30'
                    }`}
                    src="nouns/glasses-square-red.png"
                    alt="Glasses Square Red"
                />
            </Link>

            <button
                className="h-[27px] w-[67px] rounded-full bg-[#2B83F6] relative"
                onClick={switchProject}
            >
                <div
                    className={`h-[17px] w-[17px] absolute bg-white rounded-full top-1/2 -translate-y-1/2 ${
                        pathname === '/lils' ? 'right-1' : 'left-1'
                    }`}
                ></div>

                <div
                    className={`text-[8px] font-bold text-white uppercase ${
                        pathname === '/lils' ? '-ml-3' : '-mr-3'
                    }`}
                >
                    {pathname === '/lils' ? 'Lils' : 'Nouns'}
                </div>
            </button>

            <Link href={lilsLink}>
                <SpacesImage
                    className={`h-[17px] ${
                        pathname === '/lils' ? 'opacity-100' : 'opacity-30'
                    }`}
                    src="lils/glasses-square-red.png"
                    alt="Glasses Square Red"
                />
            </Link>
        </div>
    )
}
