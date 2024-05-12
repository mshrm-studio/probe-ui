'use client'

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'
import React from 'react'

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string
const infuraApiKey = process.env.NEXT_PUBLIC_INFURA_API_KEY as string
const defaultChainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID as string)
const mainnetRpcUrl = `https://mainnet.infura.io/v3/${infuraApiKey}`
const sepoliaRpcUrl = `https://sepolia.infura.io/v3/${infuraApiKey}`

// 2. Set chains
const mainnet = {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: mainnetRpcUrl,
}

const sepolia = {
    chainId: 11155111,
    name: 'Sepolia',
    currency: 'ETH',
    explorerUrl: 'https://sepolia.etherscan.io',
    rpcUrl: sepoliaRpcUrl,
}

// 3. Create a metadata object
const metadata = {
    name: 'probe.wtf',
    description: 'Probing Nouns & LilNouns.',
    url: 'https://probe.wtf', // origin must match your domain & subdomain
    icons: ['https://avatars.mywebsite.com/'],
}

// 4. Create Ethers config
const ethersConfig = defaultConfig({
    /*Required*/
    metadata,

    /*Optional*/
    enableEIP6963: true, // true by default
    enableInjected: true, // true by default
    enableCoinbase: true, // true by default
    rpcUrl: defaultChainId == 1 ? mainnetRpcUrl : sepoliaRpcUrl, // used for the Coinbase SDK
    defaultChainId: defaultChainId, // used for the Coinbase SDK
})

// 5. Create a Web3Modal instance
createWeb3Modal({
    ethersConfig,
    chains: [mainnet, sepolia].filter(
        (chain) => chain.chainId == defaultChainId
    ),
    projectId,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    enableOnramp: true, // Optional - false as default
})

export default function Web3Modal({ children }: { children: React.ReactNode }) {
    return children
}
