import { useCallback, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import Form from "../form";
import Fieldset from "../fieldset";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import useInputValue from "../../helpers/useInputValue";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import wait from "../../helpers/wait";
import useLatestRef from "../../helpers/useLatestRef";

import cs from "./stack-page.module.css";

class Stack<T> {
  #data: T[] = [];

  get size(): number {
    return this.#data.length;
  }

  push(el: T): void {
    this.#data.push(el);
  }

  pop(): T | undefined {
    return this.#data.pop();
  }

  map<U>(fn: (el: T, idx: number) => U): U[] {
    return this.#data.map(fn);
  }
}

const enum State {
  Idle,
  Adding,
  Removing,
}

export const StackPage = (): JSX.Element => {
  const [stack, setStack] = useState<Stack<string>>(() => new Stack());
  const lastStack = useLatestRef(stack);
  const [addValue, setAddValue, setRawValue] = useInputValue();
  const [headChanging, setHeadChanging] = useState(false);
  const [state, setState] = useState<State>(State.Idle);

  const pushFun = useCallback(async () => {
    setState(State.Adding);

    lastStack.current.push(addValue.current);

    setHeadChanging(true);
    await wait(500);
    setHeadChanging(false);

    setRawValue("");
    setState(State.Idle);
  }, [addValue, setRawValue, lastStack]);

  const popFun = useCallback(async () => {
    setState(State.Removing);

    setHeadChanging(true);
    await wait(500);
    setHeadChanging(false);

    lastStack.current.pop();

    setState(State.Idle);
  }, [lastStack]);

  const clearFun = useCallback(() => {
    setStack(new Stack());
  }, []);

  return (
    <SolutionLayout title="Стек">
      <Form onSubmit={pushFun}>
        <Fieldset>
          <Input
            type="text"
            required
            maxLength={4}
            isLimitText
            onChange={setAddValue}
            disabled={state !== State.Idle}
            value={addValue.current}
          />
          <Button
            type="submit"
            text="Добавить"
            isLoader={state === State.Adding}
            disabled={state !== State.Idle}
          />
        </Fieldset>
        <Button
          type="button"
          text="Удалить"
          disabled={state !== State.Idle || stack.size === 0}
          isLoader={state === State.Removing}
          onClick={popFun}
        />
        <Button
          type="button"
          text="Очистить"
          disabled={state !== State.Idle || stack.size === 0}
          onClick={clearFun}
          extraClass={cs.marginLeft}
        />
      </Form>
      <div className={cs.stack}>
        {stack.map((el, i) => {
          if (i === stack.size - 1) {
            return (
              <Circle
                key={i}
                letter={el}
                index={i}
                head="top"
                state={
                  headChanging ? ElementStates.Changing : ElementStates.Default
                }
              />
            );
          }
          return <Circle key={i} letter={el} index={i} />;
        })}
      </div>
    </SolutionLayout>
  );
};
