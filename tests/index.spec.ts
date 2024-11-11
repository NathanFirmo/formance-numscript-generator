import { generateNumscript } from '../src'
import { readFile } from 'fs/promises'

describe('Formance Numscript Generator', () => {
  test('Transfer with limited overdraft', async () => {
    const file = Buffer.from(
      await readFile('./tests/numscript-outputs/limited-overdraft.txt')
    ).toString()

    const script = generateNumscript({
      asset: 'USD/2',
      amount: 100,
      source: [{ account: '@foo', overdraftLimit: 50 }],
      destination: [{ account: '@bar' }],
      txMeta: { test: 'Transfer with limited overdraft' },
    })

    expect(script.trim()).toEqual(file.trim())
  })

  test('Transfer with max allocation from specific source', async () => {
    const file = Buffer.from(
      await readFile(
        'tests/numscript-outputs/multiple-sources-with-max-allocation.txt'
      )
    ).toString()

    const script = generateNumscript({
      asset: 'COIN',
      amount: 100,
      source: [
        { account: '@users:001:wallet', maxValue: 10 },
        { account: '@payments:001' },
      ],
      destination: [{ account: '@orders:001' }],
      txMeta: { test: 'Transfer with max allocation from specific source' },
      accountMeta: { '@users:001:wallet': { limit: 'low' } },
    })

    expect(script.trim()).toEqual(file.trim())
  })

  test('Transfer with multiple source accounts', async () => {
    const file = Buffer.from(
      await readFile('tests/numscript-outputs/multiple-sources.txt')
    ).toString()

    const script = generateNumscript({
      asset: 'COIN',
      amount: 100,
      source: [{ account: '@users:001:wallet' }, { account: '@payments:001' }],
      destination: [{ account: '@orders:001' }],
      txMeta: { test: 'Transfer with multiple source accounts' },
      accountMeta: { '@users:001:wallet': { limit: 'high' } },
    })

    expect(script.trim()).toEqual(file.trim())
  })

  test('Save statement', async () => {
    const file = Buffer.from(
      await readFile('tests/numscript-outputs/save-operation.txt')
    ).toString()

    const script = generateNumscript({
      asset: 'USD/2',
      amount: 100,
      save: [{ asset: 'USD/2', amount: 100, account: '@merchants:1234' }],
      source: [{ account: '@merchants:1234' }],
      destination: [{ account: '@payouts:T1891G' }],
      txMeta: { test: 'Save operation' },
    })

    expect(script.trim()).toEqual(file.trim())
  })

  test('Simple transfer', async () => {
    const file = Buffer.from(
      await readFile('tests/numscript-outputs/simple-transfer.txt')
    ).toString()

    const script = generateNumscript({
      asset: 'COIN',
      amount: 100,
      source: [{ account: '@world' }],
      destination: [{ account: '@users:001' }],
      txMeta: {
        reference: 'TX001',
        purpose: 'reward',
        test: 'Simple transfer',
      },
      accountMeta: { '@users:001': { status: 'active', tier: 'gold' } },
    })

    expect(script.trim()).toEqual(file.trim())
  })

  test('Transfer to multiple destinations with equal fractions', async () => {
    const file = Buffer.from(
      await readFile(
        'tests/numscript-outputs/split-destination-with-fraction.txt'
      )
    ).toString()

    const script = generateNumscript({
      asset: 'COIN',
      amount: 99,
      source: [{ account: '@world' }],
      destination: [
        { account: '@a', fraction: '1/5' },
        { account: '@b', fraction: '1/5' },
        { account: '@c', fraction: '1/5' },
        { account: '@d', fraction: '1/5' },
        { account: '@e', fraction: '1/5' },
      ],
      txMeta: {
        test: 'Transfer to multiple destinations with equal fractions',
      },
    })

    expect(script.trim()).toEqual(file.trim())
  })

  test('Split transfer with percentage and remainder', async () => {
    const file = Buffer.from(
      await readFile(
        'tests/numscript-outputs/split-destination-with-percentage.txt'
      )
    ).toString()

    const script = generateNumscript({
      asset: 'USD/2',
      amount: 'ALL_AVAILABLE',
      source: [{ account: '@order:1234' }],
      destination: [
        { account: '@platform:fees', percentage: 10 },
        { account: '@merchant:5678', remainder: true },
      ],
      txMeta: {
        reference: 'TX002',
        purpose: 'orderPayment',
        test: 'Split transfer with percentage and remainder',
      },
      accountMeta: { '@merchant:5678': { region: 'NA' } },
    })

    expect(script.trim()).toEqual(file.trim())
  })

  test('Transfer with unbounded overdraft', async () => {
    const file = Buffer.from(
      await readFile('tests/numscript-outputs/unbounded-overdraft.txt')
    ).toString()

    const script = generateNumscript({
      asset: 'USD/2',
      amount: 100,
      source: [{ account: '@foo', overdraftLimit: 'UNBOUNDED' }],
      destination: [{ account: '@bar' }],
      txMeta: { test: 'Transfer with unbounded overdraft' },
    })

    expect(script.trim()).toEqual(file.trim())
  })
})
