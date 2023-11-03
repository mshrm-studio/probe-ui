'use client'
import NounSwitcher from '@/components/NounsSwitcher'
import SpacesImage from '@/components/SpacesImage'

export default function Footer() {
    return (
        <footer className="mt-6">
            <div className="flex justify-between items-center">
                <div>
                    <SpacesImage
                        className="h-[45px]"
                        src="logo.png"
                        alt="Probe Logo"
                    />
                </div>

                <NounSwitcher />
            </div>
        </footer>
    )
}
