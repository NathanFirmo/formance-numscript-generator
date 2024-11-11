import { NumscriptTransaction } from './types'

export const formatAccount = (
  source: NumscriptTransaction['source'][0],
  asset: string
) => {
  if (source.maxValue !== undefined) {
    return `max [${asset} ${source.maxValue}] from @${source.account}`
  }

  if (source.fraction) {
    return `${source.fraction} from @${source.account}`
  }

  if (source.remainder) {
    return `remaining from @${source.account}`
  }

  if (source.overdraftLimit === 'UNBOUNDED') {
    return `@${source.account} allowing unbounded overdraft`
  }

  if (source.overdraftLimit !== undefined) {
    return `@${source.account} allowing overdraft up to [${asset} ${source.overdraftLimit}]`
  }

  return `@${source.account}`
}

export const resolveSource = (tx: NumscriptTransaction) => {
  if (tx.source.length === 1) {
    return formatAccount(tx.source[0], tx.asset)
  }

  return `{\n ${tx.source.map((s) => '   ' + formatAccount(s, tx.asset)).join('\n ')}\n  }`
}

export const resolveDestination = (tx: NumscriptTransaction) => {
  if (tx.destination.length === 1) {
    return `@${tx.destination[0].account}`
  }

  return `{\n    ${tx.destination
    .map((dest) => {
      if (dest.fraction) return `${dest.fraction} to @${dest.account}`
      if (dest.remainder) return `remaining to @${dest.account}`
      return `to @${dest.account}`
    })
    .join('\n    ')}\n  }`
}

export const resolveSaveStatement = (tx: NumscriptTransaction) => {
  return (
    tx.save
      ?.map(
        (saveItem) =>
          `save [${saveItem.asset} ${saveItem.amount}] from @${saveItem.account}`
      )
      .join('\n') ?? ''
  )
}

export const resolveTxMeta = (tx: NumscriptTransaction) => {
  return tx.txMeta
    ? Object.entries(tx.txMeta)
        .map(([key, value]) => `set_tx_meta("${key}", "${value}")`)
        .join('\n')
    : ''
}

export const resolveAccountMeta = (tx: NumscriptTransaction) => {
  return tx.accountMeta
    ? Object.entries(tx.accountMeta)
        .flatMap(([account, meta]) =>
          Object.entries(meta).map(
            ([key, value]) =>
              `set_account_meta(@${account}, "${key}", "${value}")`
          )
        )
        .join('\n')
    : ''
}
