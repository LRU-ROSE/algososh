import { useRef } from 'react';
import type { MutableRefObject } from 'react';

function useLatestRef<T>(value: T): MutableRefObject<T> {
  const ref = useRef<T>();
  ref.current = value;
  return ref as MutableRefObject<T>;
}

export default useLatestRef;
