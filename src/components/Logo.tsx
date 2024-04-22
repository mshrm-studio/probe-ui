import SpacesImage from '@/components/SpacesImage'

export default function Logo({ className }: { className?: string }) {
    return (
        <SpacesImage
            src="Probe_Logo.svg"
            alt="Probe Logo"
            className={className}
        />
    )
}
