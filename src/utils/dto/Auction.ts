export default interface Auction {
    nounId: number
    amount: string
    startTime: number
    endTime: number
    bidder: string
    settled: boolean
}
