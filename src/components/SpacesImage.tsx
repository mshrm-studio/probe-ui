type Props = {
    alt?: string
    className?: string
    src: string
}

const SpacesImage: React.FC<Props> = ({ alt, className, src }) => {
    const spacesStorageUrl = process.env.NEXT_PUBLIC_DO_STORAGE_URL

    const fullImageSrc = src.startsWith('http')
        ? src
        : src.startsWith('/')
        ? `${spacesStorageUrl}${src}`
        : `${spacesStorageUrl}/${src}`

    return <img className={className} src={fullImageSrc} alt={alt} />
}

export default SpacesImage
