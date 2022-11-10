/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  decompose,
  LengthOf,
  StateMatching,
  StateValue,
  TuplifyUnion,
} from '@bemedev/decompose';
import type { MutableRefObject } from 'react';
import type {
  EventObject,
  Interpreter,
  Prop,
  StateFrom,
  TypegenEnabled,
  Typestate,
} from 'xstate';

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

export const defaultCompare = <T>(a: T, b: T) => a === b;

export type MatchOptions<T extends string = string> =
  | {
      or: MatchOptions<T>[];
    }
  | { and: MatchOptions<T>[] }
  | T;

function buildMatches(
  decomposeds: readonly string[],
  value: MatchOptions,
): boolean {
  let out = false;
  if (typeof value === 'string') {
    out = decomposeds.includes(value);
  } else if ('or' in value) {
    const _values = value.or;
    out = _values
      .map(value => buildMatches(decomposeds, value))
      .some(value => value === true);
  } else {
    const _values = value.and;
    out = _values
      .map(value => buildMatches(decomposeds, value))
      .every(value => value === true);
  }

  return out;
}

export function matches<T extends StateValue = StateValue>(value?: T) {
  if (!value) {
    return () => false;
  }
  const decomposeds = decompose(value);
  return (...values: MatchOptions<StateMatching<T>>[]) => {
    const matchers = values.map(value => buildMatches(decomposeds, value));
    return matchers.every(matcher => matcher === true);
  };
}

export function defaultSelector<Input, Output>(value: Input) {
  return value as unknown as Output;
}

type Arr = readonly any[];

export function partialCall<T extends Arr, U extends Arr, R>(
  f: (...args: [...T, ...U]) => R,
  ...headArgs: T
) {
  return (...tailArgs: U) => f(...headArgs, ...tailArgs);
}

type TSV<T> = T extends TypegenEnabled
  ? Prop<Prop<T, 'resolved'>, 'matchesStates'>
  : never;

export type UseMatchesProps<T> = MatchOptions<
  StateMatching<TSV<T> extends StateValue ? TSV<T> : StateValue>
>[];

export type SenderReturn<
  TEvents extends EventObject,
  T extends TEvents['type'],
> = Required<TEvents> extends { type: T } & infer U
  ? LengthOf<TuplifyUnion<Extract<U, { type: T }>>> extends 0
    ? []
    : [Omit<Extract<TEvents, { type: T }>, 'type'>]
  : never;
