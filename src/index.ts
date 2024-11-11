import {
  resolveAccountMeta,
  resolveSaveStatement,
  resolveTxMeta,
  resolveDestination,
  resolveSource,
} from './resolvers'
import { NumscriptTransaction } from './types'
export { NumscriptTransaction } from './types'

export const generateNumscript = (tx: NumscriptTransaction) => {
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
