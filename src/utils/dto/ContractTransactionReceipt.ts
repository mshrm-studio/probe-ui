export default interface ContractTransactionReceipt {
    blobGasPrice: null
    blobGasUsed: null
    blockHash: string
    blockNumber: number
    contractAddress: string | null
    cumulativeGasUsed: bigint
    from: string
    gasPrice: bigint
    gasUsed: bigint
    hash: string
    index: number
    logsBloom: string
    status: number
    to: string
    type: number
}
