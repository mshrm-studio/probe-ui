'use client'
import NounSwitcher from '@/components/NounsSwitcher'
import SpacesImage from '@/components/SpacesImage'
import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="mt-6">
            <div className="space-y-6 flex flex-col items-center xl:space-y-0 xl:flex-row-reverse xl:justify-between">
                <NounSwitcher />

                <div>
                    <Link href="/">
                        <SpacesImage
                            className="h-[45px]"
                            src="logo.png"
                            alt="Probe Logo"
                        />
                    </Link>
                </div>
            </div>
        </footer>
    )
}
