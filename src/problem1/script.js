/*
Implementation 01: Using for loop

*/
var sum_to_n_a = function(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }

  return sum;

};

/*
Implementation 02: Using Recursion

*/
var sum_to_n_b = function(n) {
    if(n === 0) return 0;
    const sum = n + sum_to_n_b(n - 1);

    return sum;
};

/*
Implementation 03: Using Mathematical formula

*/
var sum_to_n_c = function(n) {
  const sum = (n * (n + 1)) / 2;

  return sum;
};

console.log(sum_to_n_a(5)); // 15
console.log(sum_to_n_b(5)); // 15
console.log(sum_to_n_c(5)); // 15