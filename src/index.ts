import {
  resolveAccountMeta,
  resolveSaveStatement,
  resolveTxMeta,
  resolveDestination,
  resolveSource,
} from './resolvers'
import { NumscriptTransaction } from './types'
export { NumscriptTransaction } from './types'

export const generateNumscript = (tx: NumscriptTransaction) =>
  [
    resolveSaveStatement(tx),
    ...tx.send.map(
      (s) =>
        `send [${s.asset} ${s.amount === 'ALL_AVAILABLE' ? '*' : s.amount}] (\n  source = ${resolveSource(s)}\n  destination = ${resolveDestination(s)}\n)`
    ),
    resolveTxMeta(tx),
    resolveAccountMeta(tx),
  ]
    .filter(Boolean)
    .join('\n\n')
