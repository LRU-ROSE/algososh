import { ChangeEvent, Dispatch, MutableRefObject, SetStateAction, useCallback, useState } from "react";
import useLatestRef from "./useLatestRef";

const useInputValue = (
  initVal?: string
): [
  MutableRefObject<string>,
  (e: ChangeEvent<HTMLInputElement>) => void,
  Dispatch<SetStateAction<string>>
] => {
  const [value, setValue] = useState(initVal ?? "");
  const lastValue = useLatestRef(value);
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);
  return [lastValue, handleChange, setValue];
};

export default useInputValue;
