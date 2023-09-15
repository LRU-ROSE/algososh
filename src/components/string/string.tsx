import { useCallback, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import Form from "../form";
import Fieldset from "../fieldset";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import useInputValue from "../../helpers/useInputValue";
import { Circle } from "../ui/circle/circle";
import wait from "../../helpers/wait";
import { Char, reverseString } from "./reverse-string";
import { CIRCLE_TESTID, INPUT_TESTID, SUBMIT_TESTID } from "./constants";

import cs from "./string.module.css";

export const StringComponent = (): JSX.Element => {
  const [string, setString] = useInputValue();
  const [progress, setProgress] = useState(false);
  const [chars, setChars] = useState<Char[]>([]);
  const start = useCallback(async () => {
    setProgress(true);

    const finalChars = await reverseString(string.current, async (chars) => {
      setChars(chars);
      await wait(1000);
    });

    setChars(finalChars);
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
            testId={INPUT_TESTID}
          />
          <Button
            type="submit"
            text="Развернуть"
            isLoader={progress}
            testId={SUBMIT_TESTID}
          />
        </Fieldset>
      </Form>
      <div className={cs.chars}>
        {chars.map(({ state, value }, i) => (
          <Circle
            key={`${value}_${state}_${i}`}
            letter={value}
            state={state}
            index={i}
            testId={CIRCLE_TESTID}
          />
        ))}
      </div>
    </SolutionLayout>
  );
};
