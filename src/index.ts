import {
  resolveAccountMeta,
  resolveSaveStatement,
  resolveTxMeta,
  resolveDestination,
  resolveSource,
} from './resolvers'
import { Transaction } from './types'

export const generateNumscript = (tx: Transaction) => {
  const amount = `${tx.asset} ${tx.amount === 'ALL_AVAILABLE' ? '*' : tx.amount}`

  return [
    resolveSaveStatement(tx),
    `send [${amount}] (\n  source = ${resolveSource(tx)}\n  destination = ${resolveDestination(tx)}\n)`,
    resolveTxMeta(tx),
    resolveAccountMeta(tx),
  ]
    .filter(Boolean)
    .join('\n\n')
}
