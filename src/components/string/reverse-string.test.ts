import { Char, reverseString } from "./reverse-string";

const charsToString = (chars: Char[]): string =>
  chars.map((char) => char.value).join("");
const voidIntermediate = async () => undefined;

describe("Тестирование алгоритма разворота строки", () => {
  it("с чётным количеством символов", async () => {
    const result = await reverseString("abcdef", voidIntermediate);

    expect(charsToString(result)).toStrictEqual("fedcba");
  });
  it("с нечётным количеством символов", async () => {
    const result = await reverseString("abcde", voidIntermediate);

    expect(charsToString(result)).toStrictEqual("edcba");
  });
  it("с одним символом", async () => {
    const result = await reverseString("a", voidIntermediate);

    expect(charsToString(result)).toStrictEqual("a");
  });
  it("пустая строка", async () => {
    const result = await reverseString("", voidIntermediate);

    expect(charsToString(result)).toStrictEqual("");
  });
});
