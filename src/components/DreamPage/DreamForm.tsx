'use client'

import SearchSelectNounTrait from '@/components/SearchSelect/v2/NounTrait'
import { nounTraitLayers } from '@/utils/dto/NounTraitLayer'
import { useState } from 'react'

export default function DreamPageDreamForm() {
    const [form, setForm] = useState({
        accessory: '',
        background: '',
        body: '',
        glasses: '',
        head: '',
    })

    return (
        <div className="max-w-xs space-y-10">
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
        </div>
    )
}
