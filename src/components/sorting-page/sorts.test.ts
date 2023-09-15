import { bubbleSort, selectionSort } from "./sorts";

const simpleCompareAsc = async (arr: number[], idx1: number, idx2: number) => arr[idx2] - arr[idx1] > 0;
const simpleCompareDesc = async (arr: number[], idx1: number, idx2: number) => arr[idx1] - arr[idx2] > 0;
const voidMark = () => undefined;

describe("Тестирование алгоритма сортировки пузырьком", () => {
  it("пустой массив", async () => {
    const arr: number[] = [];
    await bubbleSort(arr, simpleCompareAsc, voidMark);

    expect(arr).toStrictEqual([]);
  });

  it("массив из одного элемента", async () => {
    const arr = [123];
    await bubbleSort(arr, simpleCompareAsc, voidMark);

    expect(arr).toStrictEqual([123]);
  });

  it("массив из нескольких элементов, возрастание", async () => {
    const arr = [3, 3, 56, 78, 9, 0];
    await bubbleSort(arr, simpleCompareAsc, voidMark);

    expect(arr).toStrictEqual([0, 3, 3, 9, 56, 78]);
  });

  it("массив из нескольких элементов, убывание", async () => {
    const arr = [3, 3, 56, 78, 9, 0];
    await bubbleSort(arr, simpleCompareDesc, voidMark);

    expect(arr).toStrictEqual([78, 56, 9, 3, 3, 0]);
  });
});

describe("Тестирование алгоритма сортировки выбором", () => {
  it("пустой массив", async () => {
    const arr: number[] = [];
    await selectionSort(arr, simpleCompareAsc, voidMark);

    expect(arr).toStrictEqual([]);
  });

  it("массив из одного элемента", async () => {
    const arr = [123];
    await selectionSort(arr, simpleCompareAsc, voidMark);

    expect(arr).toStrictEqual([123]);
  });

  it("массив из нескольких элементов, возрастание", async () => {
    const arr = [3, 3, 56, 78, 9, 0];
    await selectionSort(arr, simpleCompareAsc, voidMark);

    expect(arr).toStrictEqual([0, 3, 3, 9, 56, 78]);
  });

  it("массив из нескольких элементов, убывание", async () => {
    const arr = [3, 3, 56, 78, 9, 0];
    await selectionSort(arr, simpleCompareDesc, voidMark);

    expect(arr).toStrictEqual([78, 56, 9, 3, 3, 0]);
  });
});
