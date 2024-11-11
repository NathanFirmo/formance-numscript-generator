# formance-numscript-generator

## Motivation

Since handling [Formance Numscript](https://docs.formance.com/numscript/reference/send) over the codebase can be anoying, I've created this simple library to convert JSON to corresponding NumScripts.

## Examples

### Simple transfer

#### Input

~~~js
import { generateNumscript } from 'formance-numscript-generator'
const script = generateNumscript({
  send: [
    {
      asset: 'COIN',
      amount: 100,
      sources: [{ account: 'world' }],
      destinations: [{ account: 'users:001' }],
    },
  ],
  txMeta: {
    reference: 'TX001',
    purpose: 'reward',
    test: 'Simple transfer',
  },
  accountMeta: { 'users:001': { status: 'active', tier: 'gold' } },
})
~~~

#### Output

~~~kt
send [COIN 100] (
  source = @world
  destination = @users:001
)

set_tx_meta("reference", "TX001")
set_tx_meta("purpose", "reward")
set_tx_meta("test", "Simple transfer")

set_account_meta(@users:001, "status", "active")
set_account_meta(@users:001, "tier", "gold")
~~~

### Multiple send

#### Input

~~~js
import { generateNumscript } from 'formance-numscript-generator'
const script = generateNumscript({
  send: [
    {
      asset: 'USD/2',
      amount: 100,
      sources: [{ account: 'foo' }],
      destinations: [{ account: 'bar' }],
    },
    {
      asset: 'USD/2',
      amount: 100,
      sources: [{ account: 'bar' }],
      destinations: [{ account: 'baz' }],
    },
  ],
})
~~~

#### Output

~~~kt
send [USD/2 100] (
  source = @foo
  destination = @bar
)

send [USD/2 100] (
  source = @bar
  destination = @baz
)
~~~

### Transfer with multiple source accounts

#### Input

~~~js
import { generateNumscript } from 'formance-numscript-generator'
const script = generateNumscript({
  send: [
    {
      asset: 'COIN',
      amount: 100,
      sources: [
        { account: 'users:001:wallet' },
        { account: 'payments:001' },
      ],
      destinations: [{ account: 'orders:001' }],
    },
  ],
  txMeta: { test: 'Transfer with multiple source accounts' },
  accountMeta: { 'users:001:wallet': { limit: 'high' } },
})
~~~

#### Output

~~~kt
send [COIN 100] (
  source = {
    @users:001:wallet
    @payments:001
  }
  destination = @orders:001
)

set_tx_meta("test", "Transfer with multiple source accounts")

set_account_meta(@users:001:wallet, "limit", "high")
~~~

### Transfer with max allocation from specific source

#### Input

~~~js
import { generateNumscript } from 'formance-numscript-generator'
const script = generateNumscript({
  send: [
    {
      asset: 'COIN',
      amount: 100,
      sources: [
        { account: 'users:001:wallet', maxValue: 10 },
        { account: 'payments:001' },
      ],
      destinations: [{ account: 'orders:001' }],
    },
  ],
  txMeta: { test: 'Transfer with max allocation from specific source' },
  accountMeta: { 'users:001:wallet': { limit: 'low' } },
})
~~~

#### Output

~~~kt
send [COIN 100] (
  source = {
    max [COIN 10] from @users:001:wallet
    @payments:001
  }
  destination = orders:001
)

set_tx_meta("test", "Transfer with max allocation from specific source")

set_account_meta(@users:001:wallet, "limit", "low")
~~~


### Transfer with limited overdraft

#### Input

~~~js
import { generateNumscript } from 'formance-numscript-generator'
const script = generateNumscript({
  send: [
    {
      asset: 'USD/2',
      amount: 100,
      sources: [{ account: 'foo', overdraftLimit: 50 }],
      destinations: [{ account: 'bar' }],
    },
  ],
  txMeta: { test: 'Transfer with limited overdraft' },
})
~~~

#### Output

~~~kt
send [USD/2 100] (
  source = @foo allowing overdraft up to [USD/2 50]
  destination = @bar
)

set_tx_meta("test", "Transfer with limited overdraft")
~~~

### Transfer with unbounded overdraft

#### Input

~~~js
import { generateNumscript } from 'formance-numscript-generator'
const script = generateNumscript({
  send: [
    {
      asset: 'USD/2',
      amount: 100,
      sources: [{ account: 'foo', overdraftLimit: 'UNBOUNDED' }],
      destinations: [{ account: 'bar' }],
    },
  ],
  txMeta: { test: 'Transfer with unbounded overdraft' },
})
~~~

#### Output

~~~kt
send [USD/2 100] (
  source = @foo allowing unbounded overdraft
  destination = @bar
)

set_tx_meta("test", "Transfer with unbounded overdraft")
~~~

### Transfer to multiple destinations with equal fractions

#### Input

~~~js
import { generateNumscript } from 'formance-numscript-generator'
const script = generateNumscript({
  send: [
    {
      asset: 'COIN',
      amount: 99,
      sources: [{ account: 'world' }],
      destinations: [
        { account: 'a', fraction: '1/5' },
        { account: 'b', fraction: '1/5' },
        { account: 'c', fraction: '1/5' },
        { account: 'd', fraction: '1/5' },
        { account: 'e', fraction: '1/5' },
      ],
    },
  ],
  txMeta: {
    test: 'Transfer to multiple destinations with equal fractions',
  },
})
~~~

#### Output

~~~kt
send [COIN 99] (
  source = @world
  destination = {
    1/5 to @a
    1/5 to @b
    1/5 to @c
    1/5 to @d
    1/5 to @e
  }
)

set_tx_meta("test", "Transfer to multiple destinations with equal fractions")
~~~

### Split transfer with percentage and remainder

#### Input

~~~js
import { generateNumscript } from 'formance-numscript-generator'
const script = generateNumscript({
  send: [
    {
      asset: 'USD/2',
      amount: 'ALL_AVAILABLE',
      sources: [{ account: 'order:1234' }],
      destinations: [
        { account: 'platform:fees', fraction: '10%' },
        { account: 'merchant:5678', remainder: true },
      ],
    },
  ],
  txMeta: {
    reference: 'TX002',
    purpose: 'orderPayment',
    test: 'Split transfer with percentage and remainder',
  },
  accountMeta: { 'merchant:5678': { region: 'NA' } },
})
~~~

#### Output

~~~kt
send [USD/2 *] (
  source = @order:1234
  destination = {
    10% to @platform:fees
    remaining to @merchant:5678
  }
)

set_tx_meta("reference", "TX002")
set_tx_meta("purpose", "orderPayment")
set_tx_meta("test", "Split transfer with percentage and remainder")

set_account_meta(@merchant:5678, "region", "NA")
~~~

### Save statement

#### Input

~~~js
import { generateNumscript } from 'formance-numscript-generator'
const script = generateNumscript({
  send: [
    {
      asset: 'USD/2',
      amount: 100,
      sources: [{ account: 'merchants:1234' }],
      destinations: [{ account: 'payouts:T1891G' }],
    },
  ],
  save: [{ asset: 'USD/2', amount: 100, account: 'merchants:1234' }],
  txMeta: { test: 'Save operation' },
})
~~~

#### Output

~~~kt
save [USD/2 100] from @merchants:1234

send [USD/2 100] (
  source = @merchants:1234
  destination = @payouts:T1891G
)

set_tx_meta("test", "Save operation")
~~~
