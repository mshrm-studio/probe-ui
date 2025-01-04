'use client'

import SelectNounTrait from '@/components/Select/NounTrait'
import { NounTraitLayer, nounTraitLayers } from '@/utils/dto/NounTraitLayer'
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import Button from '@/components/Button'
import NounTrait from '@/utils/dto/NounTrait'
import styles from '@/app/nouns/dreams/create/_styles/dream.module.css'
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers/react'
import useApi from '@/utils/hooks/v2/useApi'
import { isDreamNounResponse } from '@/utils/dto/DreamNoun'
import NounSeed from '@/utils/dto/NounSeed'
import useNounTraitList from '@/utils/hooks/useNounTraitList'
import { useRouter } from 'next/navigation'
import useHref from '@/utils/hooks/useHref'
import { NounBitMap } from '@/components/Noun/BitMap'
import SelectTraitType from '@/components/Select/SelectTraitType'
import inputStyles from '@/styles/input/file.module.css'

export default function Dream() {
    const { address, isConnected } = useWeb3ModalAccount()
    const { open } = useWeb3Modal()
    const api = useApi()
    const router = useRouter()
    const { dreamsLink } = useHref()
    const [showUploadForm, setShowUploadForm] = useState(false)
    const [traitFile, setTraitFile] = useState<File | null>(null)
    const [traitLayer, setTraitLayer] = useState<NounTraitLayer>()
    const [traitBitmap, setTraitBitmap] = useState<ImageBitmap | null>(null)
    const [traitCanvas, setTraitCanvas] = useState<HTMLCanvasElement | null>(
        null
    )

    const handleTraitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (file) {
            setTraitFile(file)
            setShowUploadForm(false)
        }
    }

    useEffect(() => {
        if (!traitFile || !traitCanvas) return

        const reader = new FileReader()

        reader.onload = () => {
            const img = new Image()

            img.onload = async () => {
                const ctx = traitCanvas.getContext('2d')

                if (!ctx) return

                ctx.imageSmoothingEnabled = false
                ctx.clearRect(0, 0, 32, 32) // Clear the canvas
                ctx.drawImage(img, 0, 0, 32, 32)

                // Generate the bitmap
                const bitmap = await createImageBitmap(
                    ctx.getImageData(0, 0, 32, 32)
                )

                setTraitBitmap(bitmap) // Store the bitmap
            }

            img.src = reader.result as string
        }

        reader.readAsDataURL(traitFile)
    }, [traitFile, traitCanvas])

    const { accessoryList, backgroundList, bodyList, glassesList, headList } =
        useNounTraitList()

    const [seed, setSeed] = useState<NounSeed>({
        accessory: 0,
        background: 0,
        body: 0,
        glasses: 0,
        head: 0,
    })

    const backgroundColor = useMemo(() => {
        const bg = backgroundList.find((t) => t.seed_id == seed.background)

        return bg ? `#${bg.name}` : '#ffffff'
    }, [backgroundList, seed.background])

    const randomTrait = useCallback(
        (list: NounTrait[]) =>
            list[Math.floor(Math.random() * list.length)].seed_id,
        []
    )

    const randomise = () => {
        setSeed({
            accessory: randomTrait(accessoryList),
            background: randomTrait(backgroundList),
            body: randomTrait(bodyList),
            glasses: randomTrait(glassesList),
            head: randomTrait(headList),
        })
    }

    const dream = async (e: FormEvent) => {
        e.preventDefault()

        if (!isConnected) {
            open()
            return
        }

        try {
            const { data } = await api.post(
                '/dream-nouns',
                (() => {
                    const formData = new FormData()

                    formData.append('accessory_seed_id', String(seed.accessory))
                    formData.append(
                        'background_seed_id',
                        String(seed.background)
                    )
                    formData.append('body_seed_id', String(seed.body))

                    if (traitFile) {
                        formData.append('custom_trait_image', traitFile)
                    }

                    if (traitLayer) {
                        formData.append('custom_trait_layer', traitLayer)
                    }

                    formData.append('dreamer', String(address))
                    formData.append('glasses_seed_id', String(seed.glasses))
                    formData.append('head_seed_id', String(seed.head))

                    return formData
                })(),
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )

            if (!isDreamNounResponse(data)) {
                throw new Error('Dream created but unexpected response.')
            }

            const response = await fetch('/api/revalidate-path', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    path: '/nouns/dreams',
                }),
            })

            if (!response.ok) throw new Error('Failed to revalidate dreams.')

            alert(
                'Dream created. Please give it a few moments to appear in the gallery.'
            )

            router.push(dreamsLink)
        } catch (error: any) {
            console.error(error)
            alert(error?.response?.data?.message || error?.message || error)
        }
    }

    return (
        <div className={styles.pageContainer}>
            <div
                className={styles.image}
                style={{
                    backgroundColor: backgroundColor,
                }}
            >
                <NounBitMap
                    accessory={
                        traitLayer === 'accessory' && traitBitmap
                            ? traitBitmap
                            : seed.accessory
                    }
                    body={
                        traitLayer === 'body' && traitBitmap
                            ? traitBitmap
                            : seed.body
                    }
                    background={seed.background}
                    glasses={
                        traitLayer === 'glasses' && traitBitmap
                            ? traitBitmap
                            : seed.glasses
                    }
                    head={
                        traitLayer === 'head' && traitBitmap
                            ? traitBitmap
                            : seed.head
                    }
                />

                <div className={styles.randomiseBtnContainer}>
                    <Button color="white" onClick={randomise}>
                        Randomize
                    </Button>
                </div>
            </div>

            <div className={styles.formContainer}>
                {showUploadForm ? (
                    <form className={styles.form}>
                        <SelectTraitType
                            exclude={['background']}
                            selected={traitLayer}
                            setSelected={(value) => setTraitLayer(value)}
                        />

                        <div>
                            <label
                                htmlFor="file-upload"
                                className={inputStyles.input}
                            >
                                <span>Add Trait</span>

                                <input
                                    id="file-upload"
                                    name="file-upload"
                                    accept="image/png"
                                    type="file"
                                    className="sr-only"
                                    onChange={handleTraitUpload}
                                />
                            </label>
                        </div>

                        <canvas
                            ref={setTraitCanvas}
                            width={32}
                            height={32}
                            className="opacity-0"
                        />
                    </form>
                ) : (
                    <form className={styles.form} onSubmit={dream}>
                        {nounTraitLayers
                            .filter((layer) => layer !== traitLayer)
                            .map((layer) => (
                                <div key={layer}>
                                    <SelectNounTrait
                                        layer={layer}
                                        required
                                        selected={seed[layer]}
                                        setSelected={(value) => {
                                            setSeed((prev) => ({
                                                ...prev,
                                                [layer]: value,
                                            }))
                                        }}
                                        valueKey="seed_id"
                                    />
                                </div>
                            ))}

                        {traitFile === null && (
                            <Button
                                color="purple"
                                nativeType="button"
                                onClick={() => setShowUploadForm(true)}
                            >
                                Upload Trait
                            </Button>
                        )}

                        <Button nativeType="submit">Dream</Button>
                    </form>
                )}
            </div>
        </div>
    )
}
