'use client'
import React from 'react'
import Noun from '@/utils/dto/Noun'

type Props = {
    className?: string
    noun: Noun
}

const NounImage: React.FC<Props> = ({ className = '', noun }) => {
    const prefix = 'data:application/json;base64,'
    const jsonString = atob(noun.token_uri.replace(prefix, ''))
    const jsonObject = JSON.parse(jsonString)
    const imageSource = jsonObject?.image || ''

    return <img className={className} src={imageSource} />
}

export default NounImage
