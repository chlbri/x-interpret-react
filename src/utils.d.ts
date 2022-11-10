import { StateMatching, StateValue } from '@bemedev/decompose';
import type { MutableRefObject } from 'react';
import type {
  EventObject,
  Interpreter,
  Prop,
  StateFrom,
  TypegenEnabled,
  Typestate,
} from 'xstate';
export declare function getServiceSnapshot<
  TContext extends object,
  TEvents extends EventObject = EventObject,
  TTypestate extends Typestate<TContext> = {
    value: any;
    context: TContext;
  },
>(
  service: Interpreter<TContext, any, TEvents, TTypestate>,
): StateFrom<typeof service['machine']>;
export declare function getSnapShot<
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
): import('xstate').State<
  TContext,
  TEvents,
  any,
  TTypestate,
  import('xstate').TypegenDisabled
>;
export declare const defaultCompare: <T>(a: T, b: T) => boolean;
export declare type MatchOptions<T extends string = string> =
  | {
      or: MatchOptions<T>[];
    }
  | {
      and: MatchOptions<T>[];
    }
  | T;
export declare function matches<T extends StateValue = StateValue>(
  value?: T,
): (...values: MatchOptions<StateMatching<T>>[]) => boolean;
export declare function defaultSelector<Input, Output>(
  value: Input,
): Output;
declare type Arr = readonly any[];
export declare function partialCall<T extends Arr, U extends Arr, R>(
  f: (...args: [...T, ...U]) => R,
  ...headArgs: T
): (...tailArgs: U) => R;
declare type TSV<T> = T extends TypegenEnabled
  ? Prop<Prop<T, 'resolved'>, 'matchesStates'>
  : never;
export declare type UseMatchesProps<T> = MatchOptions<
  StateMatching<TSV<T> extends StateValue ? TSV<T> : StateValue>
>[];
export {};
//# sourceMappingURL=utils.d.ts.map
