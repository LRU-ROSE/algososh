const swap = <T,>(array: T[], idx1: number, idx2: number): void => {
  [array[idx1], array[idx2]] = [array[idx2], array[idx1]];
};

export type MarkFn<T> = (array: T[], idxSorted: number) => void;
export type CompareFn<T> = (
  array: T[],
  idx1: number,
  idx2: number
) => Promise<boolean>;

export const bubbleSort = async <T,>(
  arr: T[],
  compare: CompareFn<T>,
  markSorted: MarkFn<T>
) => {
  let unsortedLen = arr.length;
  while (unsortedLen > 1) {
    let newLen = 0;
    for (let i = 1; i < unsortedLen; i++) {
      if (await compare(arr, i, i - 1)) {
        swap(arr, i - 1, i);
        newLen = i;
      }
    }
    for (let i = newLen; i < unsortedLen; i += 1) {
      markSorted(arr, i);
    }
    unsortedLen = newLen;
  }
  markSorted(arr, 0);
};

export const selectionSort = async <T,>(
  arr: T[],
  compare: CompareFn<T>,
  markSorted: MarkFn<T>
) => {
  for (let i = 0; i < arr.length; i += 1) {
    let min = i;
    for (let j = i + 1; j < arr.length; j += 1) {
      if (await compare(arr, j, min)) {
        min = j;
      }
    }
    swap(arr, i, min);
    markSorted(arr, i);
  }
};