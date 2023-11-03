'use client'
import React from 'react'
import LilNoun from '@/utils/dto/LilNoun'

type Props = {
    className?: string
    lilNoun: LilNoun
}

const LilNounImage: React.FC<Props> = ({ className = '', lilNoun }) => {
    const prefix = 'data:application/json;base64,'
    const jsonString = atob(lilNoun.token_uri.replace(prefix, ''))
    const jsonObject = JSON.parse(jsonString)
    const imageSource = jsonObject?.image || ''

    return <img className={className} src={imageSource} />
}

export default LilNounImage
