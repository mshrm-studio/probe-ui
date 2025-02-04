import { NounTraitLayer } from '@/utils/dto/NounTraitLayer'

interface ProposalGenerationProps {
    artContributionAgreement: {
        message: string
        signature: string
        signer: string
    }
    trait: {
        layer: NounTraitLayer
        name: string
    }
}

const useProposalContent = () => {
    const generate = (props: ProposalGenerationProps) => {
        return `
            # Add ${props.trait.layer} ${props.trait.name} 

            # Submitted via [Probe](https://probe.wtf)

            ## Summary
            This proposal adds a new **${props.trait.layer}**. New ${props.trait.layer} name: **${props.trait.name}**.

            ## Nouns Art Contribution Agreement

            **Signer**:
            \`\`\`
            ${props.artContributionAgreement.signer}
            \`\`\`

            **Message**:
            \`\`\`
            ${props.artContributionAgreement.message}
            \`\`\`

            **Signature**:
            \`\`\`
            ${props.artContributionAgreement.signature}
            \`\`\`

            You can verify the signature using [Etherscan](https://etherscan.io/verifiedSignatures) or any other [EIP-191](https://eips.ethereum.org/EIPS/eip-191) verification tool.
        `
    }

    return { generate }
}

export default useProposalContent
