/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  MatchOptions,
  StateMatching,
  StateValue,
} from '@bemedev/x-matches';
import type { MutableRefObject } from 'react';
import type {
  EventObject,
  Interpreter,
  Prop,
  StateFrom,
  TypegenEnabled,
  Typestate,
} from 'xstate';

export type LengthOf<T> = T extends ReadonlyArray<unknown>
  ? T['length']
  : number;

// #region Tuplify Union
// #region Preparation
type _UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;
type _LastOf<T> = _UnionToIntersection<
  T extends unknown ? () => T : never
> extends () => infer R
  ? R
  : never;
type _Push<T extends unknown[], V> = [...T, V];
type _TuplifyUnionBoolean<T> = [T] extends [never] ? true : false;
// #endregion

export type TuplifyUnion<T> = true extends _TuplifyUnionBoolean<T>
  ? []
  : _Push<TuplifyUnion<Exclude<T, _LastOf<T>>>, _LastOf<T>>;
// #endregion

export function getServiceSnapshot<
  TContext extends object,
  TEvents extends EventObject = EventObject,
  TTypestate extends Typestate<TContext> = {
    value: any;
    context: TContext;
  },
>(
  service: Interpreter<TContext, any, TEvents, TTypestate>,
): StateFrom<typeof service['machine']> {
  return service.status !== 0
    ? service.getSnapshot()
    : service.initialState;
}

export function getSnapShot<
  TContext extends object,
  TEvents extends EventObject = EventObject,
  TTypestate extends Typestate<TContext> = {
    value: any;
    context: TContext;
  },
>(
  service: Interpreter<TContext, any, TEvents, TTypestate>,
  ref: MutableRefObject<
    StateFrom<typeof service['machine']> | null | undefined
  >,
) {
  if (service.status === 0 && ref.current) {
    return ref.current;
  }
  const snapshot = getServiceSnapshot(service);
  if (service.status === 0) {
    ref.current = snapshot;
  }
  return snapshot;
}

export type Compare = <T>(a: T, b: T) => boolean;

// ignore coverage
export const defaultCompare: Compare = (a, b) => a === b;

export function defaultSelector<Input, Output>(value: Input) {
  return value as unknown as Output;
}

// #region PartialCall
// type Arr = readonly any[];

// export function partialCall<T extends Arr, U extends Arr, R>(
//   f: (...args: [...T, ...U]) => R,
//   ...headArgs: T
// ) {
//   return (...tailArgs: U) => f(...headArgs, ...tailArgs);
// }
// #endregion

type TSV<T> = T extends TypegenEnabled
  ? Prop<Prop<T, 'resolved'>, 'matchesStates'>
  : never;

export type UseMatchesProps<T> = MatchOptions<
  StateMatching<TSV<T> extends StateValue ? TSV<T> : StateValue>
>[];

// #region ReducerSender
type ReducerSender<TEvents, T extends string> = LengthOf<
  TuplifyUnion<
    Required<
      Extract<
        TEvents,
        {
          type: T;
        }
      >
    >
  >
>;
// #endregion

// #region SenderReturn
export type SenderReturn<
  TEvents extends EventObject,
  T extends TEvents['type'],
> = TEvents extends { type: T } & infer U
  ? ReducerSender<U, T> extends 0
    ? []
    : [Omit<Extract<TEvents, { type: T }>, 'type'>]
  : never;
// #endregion

// #region SubType
type FilterFlags<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};

type AllowedNames<Base, Condition> = FilterFlags<
  Base,
  Condition
>[keyof Base];

export type SubType<Base extends object, Condition> = Pick<
  Base,
  AllowedNames<Base, Condition>
>;
// #endregion

type Fn<P extends any[] = any, R = any> = (...arg: P) => R;
type KeysFn<T extends object = object> = keyof SubType<T, Fn>;

function _reFunction<P extends any[] = any[], R = any>(
  fn: Fn<P, R>,
  bind: any,
) {
  return (...args: P) => fn.bind(bind)(...args);
}

export function reFunction<
  T extends object = object,
  FnKey extends KeysFn<T> = KeysFn<T>,
>(object: T, fn: FnKey) {
  const _fn = object[fn];
  type Pm = T[FnKey] extends (...args: infer P) => any ? P : any[];
  type Re = T[FnKey] extends (...args: any) => infer R ? R : any;
  return _reFunction<Pm, Re>(_fn as any, object);
}
