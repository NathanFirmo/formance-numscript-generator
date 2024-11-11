export interface Transaction {
  asset: string
  amount: number | 'ALL_AVAILABLE'
  source: Array<{
    account: string
    maxValue?: number
    fraction?: string
    overdraftLimit?: number | 'UNBOUNDED'
    remainder?: boolean
  }>
  destination: Array<Destination>
  save?: Array<{
    asset: string
    amount: number
    account: string
  }>
  txMeta?: Record<string, string>
  accountMeta?: Record<string, Record<string, string>>
}

export interface Destination {
  account: string | Destination
  fraction?: string
  remainder?: boolean
}
