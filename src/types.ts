export interface NumscriptTransaction {
  send: Array<Send>
  save?: Array<{
    asset: string
    amount: number
    account: string
  }>
  txMeta?: Record<string, string>
  accountMeta?: Record<string, Record<string, string>>
}

export interface Send {
  asset: string
  amount: number | 'ALL_AVAILABLE'
  sources: Array<Source>
  destinations: Array<Destination>
}

export interface Source {
  account: string
  maxValue?: number
  fraction?: string
  overdraftLimit?: number | 'UNBOUNDED'
  remainder?: boolean
}

export interface Destination {
  account: string | Destination
  fraction?: string
  remainder?: boolean
}
