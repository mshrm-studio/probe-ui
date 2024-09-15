import MintDate from '@/components/Noun/MintDate'

type Props = {
    className?: string
    mintedAt: string
}

const NounPageMintedAt: React.FC<Props> = ({ className, mintedAt }) => {
    return (
        <span className={className}>
            Minted <MintDate mintedAt={mintedAt} />
        </span>
    )
}

export default NounPageMintedAt
