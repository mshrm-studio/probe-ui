'use client'
import NounSwitcher from '@/components/NounsSwitcher'

export default function Header() {
    return (
        <header>
            <div className="inline-block">
                <NounSwitcher />
            </div>
        </header>
    )
}
