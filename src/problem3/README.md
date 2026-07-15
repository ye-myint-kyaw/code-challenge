# Problem 3: Messy React

This file explains what I fixed in `refactor.tsx`.

## What I Fixed

1. Added the missing `blockchain` field to `WalletBalance`.

The code was using `balance.blockchain`, but the type did not include it before.

2. Removed duplicated type fields.

`FormattedWalletBalance` now extends `WalletBalance`, so I do not need to repeat `currency` and `amount`.

3. Replaced the `switch` with a priority map.

Instead of using a long `switch` statement, I used `BLOCKCHAIN_PRIORITY`.
This makes the code shorter and easier to update later.

4. Fixed the filter logic.

The old code kept balances where `amount <= 0`, which does not make sense for showing wallet balances.
Now it only keeps balances with valid priority and `amount > 0`.

5. Fixed the undefined variable issue.

The old code used `lhsPriority` inside the filter, but that variable did not exist.
Now it uses `balancePriority`.

6. Simplified the sorting.

The old sorting had multiple `if` checks.
Now it sorts by subtracting priorities:

```tsx
getPriority(b.blockchain) - getPriority(a.blockchain)
```

7. Combined sorting and formatting in one `useMemo`.

Filtering, sorting, and formatting are all derived from `balances`, so I grouped them together.
This keeps the logic in one place.

8. Fixed the `useMemo` dependency.

The formatted balances depend on `balances`, but no `prices` so the dependency array uses:

```tsx
[balances]
```

9. Used the formatted balances when rendering rows.

Before, `formattedBalances` was created but not used.
Now the rows are rendered from `formattedBalances`, so `formattedAmount` works correctly.

10. Replaced the index key.

Using only `index` as a React key can cause bugs when the list changes.
Now the key uses blockchain and currency:

```tsx
key={`${balance.blockchain}-${balance.currency}`}
```

11. Added a fallback for missing prices.

If `prices[balance.currency]` is missing, it could return `undefined` and make `usdValue` become `NaN`.
Now it uses `0` as a fallback.

```tsx
const usdValue = (prices[balance.currency] ?? 0) * balance.amount;
```
