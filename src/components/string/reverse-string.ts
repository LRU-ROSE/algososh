
import { ElementStates } from "../../types/element-states";

export type Char = {
  state: ElementStates;
  value: string;
};

const swap = (ch1: Char, ch2: Char): void => {
  [ch1.value, ch2.value] = [ch2.value, ch1.value];
  ch1.state = ch2.state = ElementStates.Modified;
};

export const reverseString = async (string: string, renderIntermediate: (chars: Char[]) => Promise<void>): Promise<Char[]> => {
  const charsStates = Array.from(string, (value) => ({
    state: ElementStates.Default,
    value,
  }));
  const lastIndex = charsStates.length - 1;
  const halfLength = charsStates.length / 2;
  const maxIndex = Math.floor(halfLength) - 1;
  if (lastIndex > 0) {
    for (let i = 0; i <= maxIndex; i += 1) {
      charsStates[i].state = charsStates[lastIndex - i].state =
        ElementStates.Changing;

      if (i > 0) {
        swap(charsStates[i - 1], charsStates[lastIndex - i + 1]);
      }
      await renderIntermediate(Array.from(charsStates));
    }

    swap(charsStates[maxIndex], charsStates[lastIndex - maxIndex]);
  }

  if (maxIndex !== halfLength - 1) {
    charsStates[maxIndex + 1].state = ElementStates.Modified;
  }

  return charsStates;
}