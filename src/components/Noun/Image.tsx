'use client'

import Noun from '@/utils/dto/Noun'
import SpacesImage from '@/components/SpacesImage'
import { useMemo } from 'react'

type Props = {
    className?: string
    noun?: Noun
    tokenUri?: string
}

const NounImage: React.FC<Props> = ({
    className = 'w-full h-full',
    tokenUri,
    noun,
}) => {
    const uri = useMemo(() => {
        return tokenUri || noun?.token_uri
    }, [tokenUri, noun])

    if (uri) {
        const prefix = 'data:application/json;base64,'
        const jsonString = atob(uri.replace(prefix, ''))
        const jsonObject = JSON.parse(jsonString)
        const imageSource = jsonObject?.image || ''

        return <img className={className} src={imageSource} />
    }

    if (noun) {
        if (noun.png_url) {
            return <SpacesImage className={className} src={noun.png_url} />
        }

        if (noun.svg_url) {
            return <SpacesImage className={className} src={noun.svg_url} />
        }
    }

    return <img className={className} src="" />
}

export default NounImage
