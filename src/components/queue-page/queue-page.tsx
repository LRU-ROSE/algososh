import React, { useCallback, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Circle } from "../ui/circle/circle";
import Form from "../form";
import Fieldset from "../fieldset";
import { Input } from "../ui/input/input";
import useInputValue from "../../helpers/useInputValue";
import { Button } from "../ui/button/button";
import wait from "../../helpers/wait";
import { ElementStates } from "../../types/element-states";
import useLatestRef from "../../helpers/useLatestRef";

import cs from "./queue-page.module.css";

type ElType<T> =
  | { isHole: true; isAfterTail: boolean }
  | { isHole: false; isHead: boolean; isTail: boolean; data: T };

class Queue<T> {
  #data: (T | undefined)[];
  #headIdx = -1;
  #tailIdx = -1;
  #size: number;

  constructor(size: number) {
    this.#size = size;
    this.#data = new Array(size);
  }

  get elementsCount(): number {
    if (this.#headIdx === -1) {
      return 0;
    }
    return this.#tailIdx - this.#headIdx + 1;
  }

  get isChanged(): boolean {
    return this.#headIdx !== -1;
  }

  get canEnqueue(): boolean {
    return this.#tailIdx < this.#size - 1;
  }

  get canDequeue(): boolean {
    return this.#headIdx !== -1 && this.#headIdx <= this.#tailIdx;
  }

  enqueue(el: T): void {
    if (!this.canEnqueue) {
      return;
    }
    this.#headIdx = this.#headIdx === -1 ? 0 : this.#headIdx;
    this.#tailIdx = this.#tailIdx + 1;
    this.#data[this.#tailIdx] = el;
  }

  dequeue(): T | undefined {
    if (!this.canDequeue) {
      return;
    }
    const rv = this.#data[this.#headIdx];
    this.#data[this.#headIdx] = undefined;
    this.#headIdx = this.#headIdx + 1;
    return rv;
  }

  map<U>(fn: (el: ElType<T>, idx: number) => U): U[] {
    const rv = new Array(this.#size);
    for (let i = 0; i < this.#size; i += 1) {
      if (i < this.#headIdx || i > this.#tailIdx) {
        rv[i] = fn({ isHole: true, isAfterTail: i === this.#tailIdx + 1 }, i);
      } else {
        rv[i] = fn(
          {
            isHole: false,
            isHead: i === this.#headIdx,
            isTail: i === this.#tailIdx,
            data: this.#data[i] as T,
          },
          i
        );
      }
    }
    return rv;
  }
}

const enum State {
  Idle,
  Adding,
  Removing,
}

const enum Changing {
  Nothing,
  Tail,
  AfterTail,
  Head,
}

const QUEUE_SIZE = 7;

export const QueuePage = (): JSX.Element => {
  const [queue, setQueue] = useState<Queue<string>>(
    () => new Queue(QUEUE_SIZE)
  );
  const lastQueue = useLatestRef(queue);
  const [addValue, setAddValue, setRawValue] = useInputValue();
  const [changing, setChanging] = useState(Changing.Nothing);
  const [state, setState] = useState<State>(State.Idle);

  const enqueueFun = useCallback(async () => {
    setState(State.Adding);

    setChanging(Changing.AfterTail);
    await wait(500);
    setChanging(Changing.Tail);
    lastQueue.current.enqueue(addValue.current);
    await wait(500);
    setChanging(Changing.Nothing);

    setRawValue("");
    setState(State.Idle);
  }, [addValue, setRawValue, lastQueue]);

  const dequeueFun = useCallback(async () => {
    setState(State.Removing);

    setChanging(Changing.Head);
    await wait(500);
    setChanging(Changing.Nothing);
    lastQueue.current.dequeue();

    setState(State.Idle);
  }, [lastQueue]);

  const clearFun = useCallback(() => {
    setQueue(new Queue(QUEUE_SIZE));
  }, []);

  return (
    <SolutionLayout title="Очередь">
      <Form onSubmit={enqueueFun}>
        <Fieldset>
          <Input
            type="text"
            required
            maxLength={4}
            isLimitText
            onChange={setAddValue}
            disabled={state !== State.Idle || !queue.canEnqueue}
            value={addValue.current}
          />
          <Button
            type="submit"
            text="Добавить"
            isLoader={state === State.Adding}
            disabled={state !== State.Idle || !queue.canEnqueue}
          />
        </Fieldset>
        <Button
          type="button"
          text="Удалить"
          disabled={state !== State.Idle || !queue.canDequeue}
          isLoader={state === State.Removing}
          onClick={dequeueFun}
        />
        <Button
          type="button"
          text="Очистить"
          disabled={state !== State.Idle || !queue.isChanged}
          onClick={clearFun}
          extraClass={cs.marginLeft}
        />
      </Form>
      <div className={cs.queue}>
        {queue.map((data, i) => {
          if (data.isHole) {
            return (
              <Circle
                key={i}
                letter=""
                index={i}
                state={
                  data.isAfterTail && changing === Changing.AfterTail
                    ? ElementStates.Changing
                    : ElementStates.Default
                }
              />
            );
          }
          const isChanging =
            (data.isHead && changing === Changing.Head) ||
            (data.isTail && changing === Changing.Tail);
          return (
            <Circle
              key={i}
              letter={data.data}
              index={i}
              head={data.isHead ? "head" : undefined}
              tail={data.isTail ? "tail" : undefined}
              state={
                isChanging ? ElementStates.Changing : ElementStates.Default
              }
            />
          );
        })}
      </div>
    </SolutionLayout>
  );
};
