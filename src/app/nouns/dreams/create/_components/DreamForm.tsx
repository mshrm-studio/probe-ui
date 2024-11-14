'use client'

import SearchSelectNounTrait from '@/components/SearchSelect/NounTrait'
import { nounTraitLayers } from '@/utils/dto/NounTraitLayer'
import { FormEvent, useContext, useEffect, useState } from 'react'
import Button from '@/components/Button'
import NounTraitsContext from '@/utils/contexts/NounTraitsContext'
import NounTrait from '@/utils/dto/NounTrait'
import styles from '@/utils/styles/nouns/dreams/create.module.css'
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers/react'
import useApi from '@/utils/hooks/v2/useApi'
import { isDreamNounResponse } from '@/utils/dto/DreamNoun'
import NounImageFromSeed from '@/components/Noun/ImageFromSeed'
import NounSeed from '@/utils/dto/NounSeed'

export default function DreamPageDreamForm() {
    const { address, isConnected } = useWeb3ModalAccount()
    const { open } = useWeb3Modal()

    const api = useApi()

    const { accessoryList, backgroundList, bodyList, glassesList, headList } =
        useContext(NounTraitsContext)

    const randomTraitName = (list: NounTrait[]) =>
        list[Math.floor(Math.random() * list.length)].name

    const [form, setForm] = useState({
        accessory: randomTraitName(accessoryList),
        background: randomTraitName(backgroundList),
        body: randomTraitName(bodyList),
        glasses: randomTraitName(glassesList),
        head: randomTraitName(headList),
    })

    useEffect(() => {
        const accessory = accessoryList.find((a) => a.name === form.accessory),
            background = backgroundList.find((b) => b.name === form.background),
            body = bodyList.find((b) => b.name === form.body),
            glasses = glassesList.find((g) => g.name === form.glasses),
            head = headList.find((h) => h.name === form.head)

        if (!accessory || !background || !body || !glasses || !head) return

        setSeed({
            accessory: accessory.seed_id,
            background: background.seed_id,
            body: body.seed_id,
            glasses: glasses.seed_id,
            head: head.seed_id,
        })
    }, [form])

    const [seed, setSeed] = useState<NounSeed>({
        accessory: 0,
        background: 0,
        body: 0,
        glasses: 0,
        head: 0,
    })

    const dream = async (e: FormEvent) => {
        e.preventDefault()

        if (!isConnected) {
            open()
            return
        }

        const data = {
            dreamer: address,
            accessory_seed_id: seed.accessory,
            background_seed_id: seed.background,
            body_seed_id: seed.body,
            glasses_seed_id: seed.glasses,
            head_seed_id: seed.head,
        }

        try {
            const res = await api.post('/dream-nouns', data)

            if (!isDreamNounResponse(res.data)) {
                throw new Error('Dream created but unexpected response.')
            }

            alert('Dream created!')
        } catch (error) {
            alert(error)
        }
    }

    return (
        <div className={styles.pageContainer}>
            <div
                className={styles.image}
                style={{ backgroundColor: `#${form.background}` }}
            >
                <NounImageFromSeed seed={seed} />
            </div>

            <div className={styles.formContainer}>
                <form className={styles.form} onSubmit={dream}>
                    {nounTraitLayers.map((layer) => (
                        <SearchSelectNounTrait
                            key={layer}
                            layer={layer}
                            selected={form[layer]}
                            setSelected={(value) =>
                                setForm({ ...form, [layer]: value || '' })
                            }
                        />
                    ))}

                    <Button nativeType="submit">Dream</Button>
                </form>
            </div>
        </div>
    )
}
