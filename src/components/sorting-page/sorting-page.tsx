import { useCallback, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";

import { ElementStates } from "../../types/element-states";
import { Column } from "../ui/column/column";
import Fieldset from "../fieldset";
import Form from "../form";
import { Button } from "../ui/button/button";
import { RadioInput } from "../ui/radio-input/radio-input";
import { Direction } from "../../types/direction";
import useLatestRef from "../../helpers/useLatestRef";
import wait from "../../helpers/wait";
import getUniformRand from "../../helpers/getUniformRand";
import { CompareFn, MarkFn, bubbleSort, selectionSort } from "./sorts";

import cs from "./sorting-page.module.css";

type ArrayEl = {
  state: ElementStates;
  value: number;
};

const createArray = (): ArrayEl[] => {
  const length = getUniformRand(3, 17);
  const rv: ArrayEl[] = new Array(length);
  for (let i = 0; i < length; i += 1) {
    rv[i] = { value: getUniformRand(0, 100), state: ElementStates.Default };
  }
  return rv;
};

const enum SortingState {
  Idle,
  AscSorting,
  DescSorting,
}

const enum SortType {
  Bubble,
  Selection,
}

export const SortingPage = (): JSX.Element => {
  const [array, setArray] = useState(createArray);
  const lastArray = useLatestRef(array);
  const [selectedType, setSelectedType] = useState(SortType.Selection);
  const lastType = useLatestRef(selectedType);
  const [state, setState] = useState(SortingState.Idle);
  const busy = state !== SortingState.Idle;

  const setSelection = useCallback(
    () => setSelectedType(SortType.Selection),
    []
  );

  const setBubble = useCallback(() => setSelectedType(SortType.Bubble), []);

  const start = useCallback(
    async (dir: Direction) => {
      switch (dir) {
        case Direction.Ascending:
          setState(SortingState.AscSorting);
          break;
        case Direction.Descending:
          setState(SortingState.DescSorting);
      }

      const compareFn: CompareFn<ArrayEl> = async (
        array,
        idx1,
        idx2
      ): Promise<boolean> => {
        const snapshot = Array.from(array, (el) => ({ ...el }));
        snapshot[idx1].state = snapshot[idx2].state = ElementStates.Changing;
        setArray(snapshot);

        await wait(400);

        switch (dir) {
          case Direction.Ascending:
            return array[idx1].value < array[idx2].value;
          case Direction.Descending:
            return array[idx1].value > array[idx2].value;
        }
      };

      const markFn: MarkFn<ArrayEl> = (array, idxSorted): void => {
        array[idxSorted].state = ElementStates.Modified;
      };

      const arrayToSort = Array.from(lastArray.current, ({ value }) => ({
        value,
        state: ElementStates.Default,
      }));
      switch (lastType.current) {
        case SortType.Bubble:
          await bubbleSort(arrayToSort, compareFn, markFn);
          break;
        case SortType.Selection:
          await selectionSort(arrayToSort, compareFn, markFn);
      }

      setArray(arrayToSort);
      setState(SortingState.Idle);
    },
    [lastArray, lastType]
  );

  const startAsc = useCallback(() => start(Direction.Ascending), [start]);
  const startDesc = useCallback(() => start(Direction.Descending), [start]);
  const refreshArray = useCallback(() => setArray(createArray()), []);

  return (
    <SolutionLayout title="Сортировка массива">
      <Form>
        <Fieldset>
          <RadioInput
            label="Выбор"
            checked={selectedType === SortType.Selection}
            onChange={setSelection}
            disabled={busy}
          />
          <RadioInput
            label="Пузырёк"
            checked={selectedType === SortType.Bubble}
            onChange={setBubble}
            disabled={busy}
          />
          <Button
            type="submit"
            sorting={Direction.Ascending}
            text="По возрастанию"
            disabled={busy}
            isLoader={state === SortingState.AscSorting}
            onClick={startAsc}
            extraClass={cs.marginLeft}
          />
          <Button
            type="submit"
            sorting={Direction.Descending}
            text="По убыванию"
            disabled={busy}
            isLoader={state === SortingState.DescSorting}
            onClick={startDesc}
          />
        </Fieldset>
        <Button
          type="button"
          text="Новый массив"
          disabled={busy}
          onClick={refreshArray}
          extraClass={cs.marginLeft}
        />
      </Form>
      <div className={cs.array}>
        {array.map(({ value, state }, i) => {
          return (
            <Column
              key={`${value}_${state}_${i}`}
              index={value}
              state={state}
            />
          );
        })}
      </div>
    </SolutionLayout>
  );
};
