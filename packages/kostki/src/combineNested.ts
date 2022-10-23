export function combineNested<T1>(
  cb: (t1: T1) => void,
  nested: [Iterable<T1>]
): void;
export function combineNested<T1, T2>(
  cb: (t1: T1, t2: T2) => void,
  nested: [Iterable<T1>, Iterable<T2>]
): void;
export function combineNested<T1, T2, T3>(
  cb: (t1: T1, t2: T2, t3: T3) => void,
  nested: [Iterable<T1>, Iterable<T2>, Iterable<T3>]
): void;
export function combineNested<T1, T2, T3, T4>(
  cb: (t1: T1, t2: T2, t3: T3, t4: T4) => void,
  nested: [Iterable<T1>, Iterable<T2>, Iterable<T3>, Iterable<T4>]
): void;
export function combineNested<T1, T2, T3, T4, T5>(
  cb: (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => void,
  nested: [Iterable<T1>, Iterable<T2>, Iterable<T3>, Iterable<T4>, Iterable<T5>]
): void;
export function combineNested<T1, T2, T3, T4, T5, T6>(
  cb: (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6) => void,
  nested: [
    Iterable<T1>,
    Iterable<T2>,
    Iterable<T3>,
    Iterable<T4>,
    Iterable<T5>,
    Iterable<T6>
  ]
): void;
export function combineNested<T>(
  cb: (...t: T[]) => void,
  nested: Iterable<T>[]
): void;
export function combineNested(
  cb: (...args: unknown[]) => void,
  nested: Iterable<unknown>[]
) {
  for (const combination of combineNestedGen(nested)) {
    cb(...combination);
  }
}

export function* combineNestedGen(
  nested: Iterable<unknown>[]
): Generator<unknown[]> {
  const [head, ...tail] = nested;

  if (!head) {
    return;
  }

  for (let item of head) {
    if (tail.length) {
      for (const x of combineNestedGen(tail)) {
        yield [item, ...x];
      }
    } else {
      yield [item];
    }
  }

  return;
}
