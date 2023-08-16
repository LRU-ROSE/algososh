import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import Form from "../form";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { useCallback, useState } from "react";
import wait from "../../helpers/wait";
import { Circle } from "../ui/circle/circle";
import useInputValue from "../../helpers/useInputValue";
import Fieldset from "../fieldset";

import cs from "./fibonacci-page.module.css";

const getFibonacciNumbers = (count: number): number[] => {
  const rv = new Array(count + 1);
  for (let i = 0; i <= count; i += 1) {
    rv[i] = i <= 1 ? 1 : rv[i - 1] + rv[i - 2];
  }
  return rv;
};

export const FibonacciPage = (): JSX.Element => {
  const [count, setCount] = useInputValue();
  const [progress, setProgress] = useState(false);
  const [numbers, setNumbers] = useState<number[]>([]);
  const start = useCallback(async () => {
    setProgress(true);

    const fibNumbers = getFibonacciNumbers(+count.current);
    for (let i = 1; i <= fibNumbers.length; i += 1) {
      setNumbers(fibNumbers.slice(0, i));
      await wait(500);
    }
    setNumbers(fibNumbers);
    setProgress(false);
  }, [count]);
  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <Form onSubmit={start}>
        <Fieldset>
          <Input
            type="number"
            required
            min={1}
            max={19}
            isLimitText
            onChange={setCount}
            disabled={progress}
            value={count.current}
          />
          <Button type="submit" text="Рассчитать" isLoader={progress} />
        </Fieldset>
      </Form>
      <div className={cs.numbers}>
        {numbers.map((n, i) => (
          <Circle key={`${n}_${i}`} letter={String(n)} index={i} />
        ))}
      </div>
    </SolutionLayout>
  );
};
