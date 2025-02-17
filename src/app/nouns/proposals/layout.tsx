import DataProxyContractProvider from '@/components/Provider/DataProxyContract'

type Props = {
    children: React.ReactNode
}

export default function NounsProposalsCreateLayout({ children }: Props) {
    return <DataProxyContractProvider>{children}</DataProxyContractProvider>
}
