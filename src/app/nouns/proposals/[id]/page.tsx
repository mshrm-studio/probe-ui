import Proposal from '@/app/nouns/proposals/[id]/_components/Proposal'

type Params = Promise<{ id: string }>

type PageProps = {
    params: Params
}

export default async function Page(props: PageProps) {
    const { id } = await props.params

    return (
        <main>
            <Proposal proposalId={id} />
        </main>
    )
}
