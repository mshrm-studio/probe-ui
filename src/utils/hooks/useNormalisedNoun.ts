import { useMemo } from 'react'
import DreamNoun, { isDreamNoun } from '@/utils/dto/DreamNoun'
import Noun from '@/utils/dto/Noun'

const useNormalisedNoun = (noun: Noun | DreamNoun) => {
    const normalisedNoun = useMemo(() => {
        return isDreamNoun(noun)
            ? {
                  accessory: {
                      name: noun.accessory?.name,
                      seedId: noun.accessory_seed_id,
                  },
                  background: {
                      name: noun.background?.name,
                      seedId: noun.background_seed_id,
                  },
                  body: {
                      name: noun.body?.name,
                      seedId: noun.body_seed_id,
                  },
                  glasses: {
                      name: noun.glasses?.name,
                      seedId: noun.glasses_seed_id,
                  },
                  head: {
                      name: noun.head?.name,
                      seedId: noun.head_seed_id,
                  },
              }
            : {
                  accessory: {
                      name: noun.accessory_name,
                      seedId: noun.accessory_index,
                  },
                  area: noun.area,
                  background: {
                      name: noun.background_name,
                      seedId: noun.background_index,
                  },
                  body: {
                      name: noun.body_name,
                      seedId: noun.body_index,
                  },
                  glasses: {
                      name: noun.glasses_name,
                      seedId: noun.glasses_index,
                  },
                  head: {
                      name: noun.head_name,
                      seedId: noun.head_index,
                  },
                  weight: noun.weight,
              }
    }, [noun])

    return normalisedNoun
}

export default useNormalisedNoun
