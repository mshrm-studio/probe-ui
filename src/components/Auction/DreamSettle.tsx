'use client'

import DreamContractContext from '@/utils/contexts/DreamContractContext'
import React, { useState, useEffect, useContext } from 'react'
import { BrowserProvider, Contract, parseUnits } from 'ethers'
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from '@web3modal/ethers/react'
import CryptoWalletConnect from '@/components/CryptoWallet/Connect'

const AuctionDreamSettle = () => {
    const [matchedBlockNumber, setMatchedBlockNumber] = useState<number>()
    const [matchedNounTraitsKey, setMatchedNounTraitsKey] = useState<string>()
    const [transactionHash, setTransactionHash] = useState<string>()
    const { httpDreamContract } = useContext(DreamContractContext)
    const { walletProvider } = useWeb3ModalProvider()
    const { isConnected } = useWeb3ModalAccount()

    // Function to check for a match
    const getDreamNounMatch = async () => {
        console.log('*** getDreamNounMatch ***')

        if (!httpDreamContract) return

        try {
            const match = await httpDreamContract.getDreamNounMatch()

            console.log('match:', match)
            console.log('match.HasMatched:', match.HasMatched)
            console.log('match.BlockNumber:', Number(match.BlockNumber))
            console.log('match.NounsTraitsKey:', match.NounTraitsKey)

            if (match.HasMatched) {
                setMatchedBlockNumber(Number(match.BlockNumber))
                setMatchedNounTraitsKey(match.NounTraitsKey)
            }
        } catch (err) {
            console.error(err)
        }
    }

    // Function to spawn the Dream Noun
    const spawnDreamNoun = async (
        blockNumber: number,
        nounsTraitsKey: string
    ) => {
        console.log('*** spawnDreamNoun ***')
        console.log('Block Number:', blockNumber)
        console.log('Nouns Traits Key:', nounsTraitsKey)

        if (!httpDreamContract || !walletProvider) return

        try {
            const provider = new BrowserProvider(walletProvider)
            const signer = await provider.getSigner()
            const contractWithSigner = httpDreamContract.connect(
                signer
            ) as Contract

            const bigIntGasEstimate =
                await contractWithSigner.spawnDreamNoun.estimateGas(
                    blockNumber,
                    nounsTraitsKey
                )

            const bigIntGasLimit = bigIntGasEstimate + bigIntGasEstimate
            const maxFeePerGas = parseUnits('250', 'gwei')
            const maxPriorityFeePerGas = parseUnits('250', 'gwei')

            console.log('Gas Estimate:', bigIntGasEstimate.toString())
            console.log('Gas Limit:', bigIntGasLimit.toString())
            console.log('Max Fee Per Gas:', maxFeePerGas.toString())
            console.log(
                'Max Priority Fee Per Gas:',
                maxPriorityFeePerGas.toString()
            )

            const tx = await contractWithSigner.spawnDreamNoun(
                blockNumber,
                nounsTraitsKey,
                {
                    gasLimit: bigIntGasLimit,
                    maxFeePerGas,
                    maxPriorityFeePerGas,
                }
            )

            setTransactionHash(tx.hash)

            console.log('Transaction successful:', tx)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if (matchedBlockNumber && matchedNounTraitsKey) {
            spawnDreamNoun(matchedBlockNumber, matchedNounTraitsKey)
        }
    }, [matchedBlockNumber, matchedNounTraitsKey])

    useEffect(() => {
        if (
            !httpDreamContract ||
            matchedBlockNumber ||
            matchedNounTraitsKey ||
            !walletProvider
        )
            return

        console.log('>>>> Running (will try again in 10 seconds)')
        getDreamNounMatch()

        const intervalId = setInterval(() => {
            console.log('>>>>>>> Re-running  (will try again in 10 seconds)')
            getDreamNounMatch()
        }, 10000)

        return () => clearInterval(intervalId)
    }, [
        httpDreamContract,
        matchedBlockNumber,
        matchedNounTraitsKey,
        walletProvider,
    ])

    return (
        <div className="lowercase font-normal space-y-3">
            <div>Dream Noun Matcher</div>

            <div>matchedBlockNumber: {matchedBlockNumber}</div>

            <div>matchedNounTraitsKey: {matchedNounTraitsKey}</div>

            <div>transactionHash: {transactionHash}</div>

            <p className="italic">
                check the console. this will run every 10 seconds until a match
                is found. at that point, a spawnDreamNoun transaction will be
                attempted. Must be logged in.
            </p>

            {!isConnected && <CryptoWalletConnect>Login</CryptoWalletConnect>}
        </div>
    )
}

export default AuctionDreamSettle
