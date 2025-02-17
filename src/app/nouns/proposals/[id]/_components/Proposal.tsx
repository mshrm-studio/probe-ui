'use client'

import {
    encodeBytes32String,
    Interface,
    keccak256,
    toUtf8Bytes,
    TransactionResponse,
} from 'ethers'
import { useContext, useEffect, useMemo, useState } from 'react'
import { nounsDataProxyContractABI } from '@/utils/contracts/NounsDataProxyContractABI'
import DataProxyContractContext from '@/utils/contexts/DataProxyContractContext'
import RpcContext from '@/utils/contexts/RpcContext'

interface Props {
    proposalId: string
}

export default function ProposalPage({ proposalId }: Props) {
    const slugEncodeBytes32String = useMemo(
        () => encodeBytes32String('my-test-proposal-1739771741236'),
        [proposalId]
    )

    const slugKeccak256toUtf8Bytes = useMemo(
        () => keccak256(toUtf8Bytes('my-test-proposal-1739771741236')),
        [proposalId]
    )
    const { httpDataProxyContract } = useContext(DataProxyContractContext)
    const { httpProvider } = useContext(RpcContext)
    const [transaction, setTransaction] = useState<TransactionResponse>()

    useEffect(() => {
        if (transaction) return

        console.log('>>>> useEffect')
        async function getTx() {
            console.log('>>>> getTx')

            if (!httpProvider) return

            const tx = await httpProvider.getTransaction(
                '0x9b7f226659636a35b4a68257e99674bc9a560ddf53244830189e580fc9782567'
            )

            if (tx) setTransaction(tx)

            console.log('tx:', tx)
        }

        getTx()
    }, [httpProvider, transaction])

    useEffect(() => {
        if (!transaction) return

        // Create an Interface instance with your contract's ABI
        const iface = new Interface(nounsDataProxyContractABI)
        try {
            // Parse the transaction data. Note: include value if relevant.
            const parsedTx = iface.parseTransaction({
                data: transaction.data,
                value: transaction.value,
            })

            if (!parsedTx) return

            console.log('Decoded transaction data:', parsedTx)
            // 1. Extract parameter names
            const paramNames = parsedTx.fragment.inputs.map(
                (input) => input.name
            )

            // 2. Extract parameter values
            const paramValues = parsedTx.args

            // 3. Combine them into a neat object
            const decodedParams: any = {}
            for (let i = 0; i < paramNames.length; i++) {
                decodedParams[paramNames[i]] = paramValues[i]
            }

            console.log('Function name:', parsedTx.name)
            console.log('Decoded params:', decodedParams)
            // parsedTx.name gives the function name (e.g. "createProposalCandidate")
            // parsedTx.args contains the decoded arguments
        } catch (err) {
            console.error('Error decoding transaction data:', err)
        }
    }, [transaction])

    // Ex TxHash: 0x9b7f226659636a35b4a68257e99674bc9a560ddf53244830189e580fc9782567

    // slugKeccak256toUtf8Bytes works

    // slugEncodeBytes32String does not work

    // use the propCandidates function of https://sepolia.etherscan.io/address/0x9040f720AA8A693F950B9cF94764b4b06079D002#readProxyContract to check if this slug/address combo has a proposal

    // then fetch the proposal tx from the backend. will need to be stored on creation.

    return (
        <div>
            <p>proposalId: {proposalId}</p>
            <p>slugEncodeBytes32String: {slugEncodeBytes32String}</p>
            <p>slugKeccak256toUtf8Bytes: {slugKeccak256toUtf8Bytes}</p>
        </div>
    )
}
