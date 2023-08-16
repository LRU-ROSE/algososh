import { useCallback, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import Form from "../form";
import Fieldset from "../fieldset";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import useInputValue from "../../helpers/useInputValue";
import { ElementStates } from "../../types/element-states";
import { Circle } from "../ui/circle/circle";
import wait from "../../helpers/wait";

import cs from "./string.module.css";

type Char = {
  state: ElementStates;
  value: string;
};

const swap = (ch1: Char, ch2: Char): void => {
  [ch1.value, ch2.value] = [ch2.value, ch1.value];
  ch1.state = ch2.state = ElementStates.Modified;
};

export const StringComponent = (): JSX.Element => {
  const [string, setString] = useInputValue();
  const [progress, setProgress] = useState(false);
  const [chars, setChars] = useState<Char[]>([]);
  const start = useCallback(async () => {
    setProgress(true);

    const charsStates = Array.from(string.current, (value) => ({
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
        setChars(Array.from(charsStates));
        await wait(1000);
      }

      swap(charsStates[maxIndex], charsStates[lastIndex - maxIndex]);
    }

    if (maxIndex !== halfLength - 1) {
      charsStates[maxIndex + 1].state = ElementStates.Modified;
    }

    setChars(charsStates);
    setProgress(false);
  }, [string]);
  return (
    <SolutionLayout title="Строка">
      <Form onSubmit={start}>
        <Fieldset>
          <Input
            type="text"
            required
            maxLength={11}
            isLimitText
            onChange={setString}
            disabled={progress}
            value={string.current}
          />
          <Button type="submit" text="Развернуть" isLoader={progress} />
        </Fieldset>
      </Form>
      <div className={cs.chars}>
        {chars.map(({ state, value }, i) => (
          <Circle
            key={`${value}_${state}_${i}`}
            letter={value}
            state={state}
            index={i}
          />
        ))}
      </div>
    </SolutionLayout>
  );
};
