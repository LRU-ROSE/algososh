import React, { Fragment, useCallback, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Circle } from "../ui/circle/circle";
import useLatestRef from "../../helpers/useLatestRef";
import useInputValue from "../../helpers/useInputValue";
import { Button, ErrorDisable } from "../ui/button/button";
import { Input } from "../ui/input/input";
import Fieldset from "../fieldset";
import Form from "../form";
import wait from "../../helpers/wait";
import { ElementStates } from "../../types/element-states";
import getUniformRand from "../../helpers/getUniformRand";
import { ArrowIcon } from "../ui/icons/arrow-icon";
import {
  INPUT_TESTID,
  CIRCLE_TESTID,
  ADD_HEAD_TESTID,
  ADD_TAIL_TESTID,
  DELETE_HEAD_TESTID,
  DELETE_TAIL_TESTID,
  INDEX_INPUT_TESTID,
  ADD_INDEX_TESTID,
  DELETE_INDEX_TESTID,
  CIRCLE_MINI_TESTID
} from "./constants";

import cs from "./list-page.module.css";

class LinkedListNode<T> {
  readonly value: T;
  next: LinkedListNode<T> | null;

  constructor(value: T, next: LinkedListNode<T> | null) {
    this.value = value;
    this.next = next;
  }
}

type ElType<T> = { isHead: boolean; isTail: boolean; data: T };

class LinkedList<T> {
  #head: LinkedListNode<T> | null = null;
  #tail: LinkedListNode<T> | null = null;
  #size = 0;

  get size(): number {
    return this.#size;
  }

  get empty(): boolean {
    return this.#size === 0;
  }

  #findNode(idx: number): LinkedListNode<T> | null {
    let node = this.#head;
    while (idx > 0 && node) {
      node = node.next;
      idx -= 1;
    }
    return node;
  }

  getByIndex(idx: number): T | undefined {
    if (idx === 0) {
      return this.#head?.value;
    }
    if (idx === this.#size - 1) {
      return this.#tail?.value;
    }
    return this.#findNode(idx)?.value;
  }

  prepend(el: T): void {
    const node = new LinkedListNode(el, this.#head);
    this.#head = node;
    if (!this.#tail) {
      this.#tail = node;
    }
    this.#size += 1;
  }

  append(el: T): void {
    const node = new LinkedListNode(el, null);
    if (this.#tail) {
      this.#tail.next = node;
    } else {
      this.#head = node;
    }
    this.#tail = node;
    this.#size += 1;
  }

  addByIndex(el: T, idx: number): void {
    if (idx < 0 || idx > this.#size) {
      return;
    }
    if (idx === this.#size) {
      this.append(el);
      return;
    }
    if (idx === 0) {
      this.prepend(el);
      return;
    }
    const node = this.#findNode(idx - 1);
    if (!node) {
      return;
    }
    node.next = new LinkedListNode(el, node.next);
    this.#size += 1;
  }

  deleteHead(): void {
    if (this.#head === null) {
      return;
    }
    this.#head = this.#head?.next ?? null;
    if (this.#head === null) {
      this.#tail = null;
    }
    this.#size -= 1;
  }

  #deleteByIndexHelper(idx: number) {
    const prevNode = this.#findNode(idx - 1);
    if (!prevNode) {
      throw new Error("Invalid state: prevNode could not be null");
    }
    prevNode.next = prevNode.next?.next ?? null;
    if (idx === this.#size - 1) {
      this.#tail = prevNode;
    }
    this.#size -= 1;
  }

  deleteTail(): void {
    if (this.#tail === null) {
      return;
    }
    if (this.#tail === this.#head) {
      this.deleteHead();
      return;
    }
    this.#deleteByIndexHelper(this.#size - 1);
  }

  deleteByIndex(idx: number) {
    if (idx < 0 || idx >= this.#size) {
      return;
    }
    if (idx === this.#size - 1) {
      this.deleteTail();
      return;
    }
    if (idx === 0) {
      this.deleteHead();
      return;
    }
    this.#deleteByIndexHelper(idx);
  }

  map<U>(fn: (el: ElType<T>, idx: number) => U): U[] {
    const rv = new Array(this.#size);
    let node = this.#head;
    let i = 0;
    while (node) {
      rv[i] = fn(
        {
          isHead: node === this.#head,
          isTail: node === this.#tail,
          data: node.value,
        },
        i
      );
      node = node.next;
      i += 1;
    }
    return rv;
  }
}

const enum State {
  Idle,
  HeadAdd,
  TailAdd,
  HeadRemove,
  TailRemove,
  IndexAdd,
  IndexRemove,
}

type ChangingType = {
  modifying?: number[];
  changed?: number;
  circleEl?: { idx: number; isTop: boolean; value: string };
};

const initList = (): LinkedList<string> => {
  const rv = new LinkedList<string>();
  const len = getUniformRand(2, 5);
  for (let i = 0; i <= len; i += 1) {
    rv.append(String(getUniformRand(0, 255)));
  }
  return rv;
};

export const ListPage = (): JSX.Element => {
  const [list] = useState<LinkedList<string>>(initList);
  const lastList = useLatestRef(list);
  const [addValue, setAddValue, setRawValue] = useInputValue();
  const [addIndex, setIndex, setRawIndex] = useInputValue();
  const [changing, setChanging] = useState<ChangingType>();
  const [state, setState] = useState<State>(State.Idle);

  const headAddFun = useCallback(async () => {
    setState(State.HeadAdd);

    const value = addValue.current;

    if (!lastList.current.empty) {
      setChanging({ circleEl: { idx: 0, value, isTop: true } });
      await wait(500);
    }
    lastList.current.prepend(value);
    setChanging({ changed: 0 });
    await wait(500);
    setChanging(undefined);

    setRawValue("");
    setState(State.Idle);
  }, [addValue, setRawValue, lastList]);

  const tailAddFun = useCallback(async () => {
    setState(State.TailAdd);

    const value = addValue.current;

    if (!lastList.current.empty) {
      setChanging({
        circleEl: { idx: lastList.current.size - 1, value, isTop: true },
      });
      await wait(500);
    }
    lastList.current.append(value);
    setChanging({ changed: lastList.current.size - 1 });
    await wait(500);
    setChanging(undefined);

    setRawValue("");
    setState(State.Idle);
  }, [addValue, setRawValue, lastList]);

  const headRemoveFun = useCallback(async () => {
    setState(State.HeadRemove);

    const value = lastList.current.getByIndex(0) ?? "";

    setChanging({ circleEl: { idx: 0, value, isTop: false } });
    await wait(500);
    lastList.current.deleteHead();
    setChanging(undefined);

    setState(State.Idle);
  }, [lastList]);

  const tailRemoveFun = useCallback(async () => {
    setState(State.TailRemove);

    const idx = lastList.current.size - 1;

    const value = lastList.current.getByIndex(idx) ?? "";

    setChanging({ circleEl: { idx, value, isTop: false } });
    await wait(500);
    lastList.current.deleteTail();
    setChanging(undefined);

    setState(State.Idle);
  }, [lastList]);

  const indexAddFun = useCallback(async () => {
    setState(State.IndexAdd);

    const value = addValue.current;
    const index = +addIndex.current;

    if (!lastList.current.empty) {
      const modifying: number[] = [];
      for (let i = 0; i <= index; i += 1) {
        setChanging({ modifying, circleEl: { idx: i, value, isTop: true } });
        await wait(500);
        modifying.push(i);
      }
    }
    lastList.current.addByIndex(value, index);
    setChanging({ changed: index });
    await wait(500);
    setChanging(undefined);

    setRawValue("");
    setRawIndex("");
    setState(State.Idle);
  }, [addValue, setRawValue, addIndex, setRawIndex, lastList]);

  const indexRemoveFun = useCallback(async () => {
    const index = +addIndex.current;
    if (index >= lastList.current.size) {
      return;
    }
    setState(State.IndexRemove);

    const modifying: number[] = [];
    for (let i = 0; i <= index; i += 1) {
      modifying.push(i);
      setChanging({ modifying });
      await wait(500);
    }
    modifying.pop();

    const value = lastList.current.getByIndex(index) ?? "";
    setChanging({ modifying, circleEl: { idx: index, value, isTop: false } });
    await wait(500);

    lastList.current.deleteByIndex(index);
    setChanging(undefined);

    setRawIndex("");
    setState(State.Idle);
  }, [addIndex, setRawIndex, lastList]);

  return (
    <SolutionLayout title="Связный список">
      <Form className={cs.form}>
        <div className={cs.formRow}>
          <Fieldset>
            <Input
              type="text"
              required
              maxLength={4}
              isLimitText
              onChange={setAddValue}
              disabled={state !== State.Idle}
              value={addValue.current}
              extraClass={cs.input}
              placeholder="Введите значение"
              testId={INPUT_TESTID}
            />
            <Button
              type="button"
              text="Добавить в head"
              linkedList="small"
              isLoader={state === State.HeadAdd}
              disabled={state !== State.Idle}
              onClick={headAddFun}
              testId={ADD_HEAD_TESTID}
            />
            <Button
              type="button"
              text="Добавить в tail"
              linkedList="small"
              isLoader={state === State.TailAdd}
              disabled={state !== State.Idle}
              onClick={tailAddFun}
              testId={ADD_TAIL_TESTID}
            />
          </Fieldset>
          <Button
            type="button"
            text="Удалить из head"
            linkedList="small"
            disabled={state !== State.Idle || list.empty}
            isLoader={state === State.HeadRemove}
            onClick={headRemoveFun}
            testId={DELETE_HEAD_TESTID}
          />
          <Button
            type="button"
            text="Удалить из tail"
            linkedList="small"
            disabled={state !== State.Idle || list.empty}
            isLoader={state === State.HeadRemove}
            onClick={tailRemoveFun}
            testId={DELETE_TAIL_TESTID}
          />
        </div>
        <div className={cs.formRow}>
          <Fieldset>
            <Input
              type="number"
              required
              min={0}
              max={list.size}
              isLimitText
              onChange={setIndex}
              disabled={state !== State.Idle}
              value={addIndex.current}
              placeholder="Введите индекс"
              extraClass={cs.input}
              testId={INDEX_INPUT_TESTID}
            />
            <Button
              type="button"
              text="Добавить по индексу"
              linkedList="big"
              errorDisable={ErrorDisable.FormError}
              isLoader={state === State.IndexAdd}
              disabled={state !== State.Idle}
              onClick={indexAddFun}
              testId={ADD_INDEX_TESTID}
            />
            <Button
              type="button"
              text="Удалить по индексу"
              linkedList="big"
              isLoader={state === State.IndexRemove}
              disabled={state !== State.Idle || list.empty || +addIndex.current >= list.size}
              onClick={indexRemoveFun}
              testId={DELETE_INDEX_TESTID}
            />
          </Fieldset>
        </div>
      </Form>
      <div className={cs.list}>
        {list.map((data, i) => {
          let head: null | JSX.Element | string = null;
          let tail: null | JSX.Element | string = null;
          let content = data.data;
          if (changing?.circleEl?.idx === i) {
            const changeEl = (
              <Circle
                letter={changing.circleEl.value}
                state={ElementStates.Changing}
                isSmall
                testId={CIRCLE_MINI_TESTID}
              />
            );
            if (changing.circleEl.isTop) {
              head = changeEl;
            } else {
              content = "";
              tail = changeEl;
            }
          }
          if (data.isHead && !head) {
            head = "head";
          }
          if (data.isTail && !tail) {
            tail = "tail";
          }
          let state = ElementStates.Default;
          if (i === changing?.changed) {
            state = ElementStates.Modified;
          } else if (changing?.modifying?.includes(i)) {
            state = ElementStates.Changing;
          }
          return (
            <Fragment key={i}>
              {i > 0 && <ArrowIcon />}
              <Circle
                letter={content}
                index={i}
                head={head}
                tail={tail}
                state={state}
                testId={CIRCLE_TESTID}
              />
            </Fragment>
          );
        })}
      </div>
    </SolutionLayout>
  );
};
