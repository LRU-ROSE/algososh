export const getFibonacciNumbers = (count: number): number[] => {
  const rv = new Array(count + 1);
  for (let i = 0; i <= count; i += 1) {
    rv[i] = i <= 1 ? 1 : rv[i - 1] + rv[i - 2];
  }
  return rv;
};