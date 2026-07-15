# Problem 1: Three Ways to Sum to N

This problem asks for 3 different ways to calculate the sum from `1` to `n`.

For example:

```js
sum_to_n(5) // 1 + 2 + 3 + 4 + 5 = 15
```

## My Solutions

### 1. Using a For Loop

```js
var sum_to_n_a = function(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }

  return sum;
};
```

This solution loops from `1` to `n` and keeps adding each number to `sum`.

Time complexity: `O(n)`

Space complexity: `O(1)`

### 2. Using Recursion

```js
var sum_to_n_b = function(n) {
  if (n === 0) return 0;
  const sum = n + sum_to_n_b(n - 1);

  return sum;
};
```

This solution keeps calling itself with `n - 1` until it reaches `0`.

Time complexity: `O(n)`

Space complexity: `O(n)` because every recursive call uses stack memory.

One downside is that this can cause a stack overflow if `n` is very large.

### 3. Using Math Formula

```js
var sum_to_n_c = function(n) {
  const sum = (n * (n + 1)) / 2;

  return sum;
};
```

This uses the formula for the sum of the first `n` natural numbers.

Time complexity: `O(1)`

Space complexity: `O(1)`

This is the most efficient solution because it does not need a loop or recursion.

## How to Run

Run this file with Node.js:

```bash
node script.js
```

Expected output:

```bash
15
15
15
```
