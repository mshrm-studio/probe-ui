import { NounTraitLayer } from '@/utils/dto/NounTraitLayer'

interface ProposalGenerationProps {
    artContributionAgreement: {
        message: string
        signature: string
        signer: string
    }
    trait: {
        image: string
        layer: NounTraitLayer
        name: string
    }
}

const useProposalContent = () => {
    const generate = (props: ProposalGenerationProps) => {
        return `
# Add ${props.trait.layer} '${props.trait.name}'

## Proposal submitted via [probe.wtf](https://probe.wtf)

## Summary
This proposal adds a new trait to the **${props.trait.layer}** layer. New ${props.trait.layer} name: **${props.trait.name}**.

**Image**:
![Trait Image](${props.trait.image})

## Nouns Art Contribution Agreement
**Signer**: ${props.artContributionAgreement.signer}  
**Message**: ${props.artContributionAgreement.message}  
**Signature**: ${props.artContributionAgreement.signature}
    `
    }

    return { generate }
}

export default useProposalContent
