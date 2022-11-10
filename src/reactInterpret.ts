/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  LengthOf,
  StateValue,
  TuplifyUnion,
} from '@bemedev/decompose';
import type {
  AreAllImplementationsAssumedToBeProvided,
  BaseActionObject,
  EventObject,
  InterpreterOptions,
  NoInfer,
  Prop,
  ResolveTypegenMeta,
  ServiceMap,
  State as StateX,
  StateMachine,
  TypegenDisabled,
  TypegenEnabled,
  Typestate,
} from 'xstate';
import { interpret } from 'xstate';
import _useSelector from './useSelector';
import { matches, UseMatchesProps } from './utils';

export default function reactInterpret<
  TContext extends object,
  TEvents extends EventObject = EventObject,
  TTypestate extends Typestate<TContext> = {
    value: any;
    context: TContext;
  },
  TAction extends BaseActionObject = BaseActionObject,
  TServiceMap extends ServiceMap = ServiceMap,
  TResolvedTypesMeta = ResolveTypegenMeta<
    TypegenDisabled,
    NoInfer<TEvents>,
    TAction,
    TServiceMap
  >,
>(
  machine: AreAllImplementationsAssumedToBeProvided<TResolvedTypesMeta> extends true
    ? StateMachine<
        TContext,
        any,
        TEvents,
        TTypestate,
        TAction,
        TServiceMap,
        TResolvedTypesMeta
      >
    : 'Some implementations missing',
  options?: InterpreterOptions,
) {
  // #region Types
  type State = StateX<TContext, TEvents, any, TTypestate>;

  type Tags = (TResolvedTypesMeta extends TypegenEnabled
    ? Prop<Prop<TResolvedTypesMeta, 'resolved'>, 'tags'>
    : string)[];
  // #endregion

  const service = interpret(machine, options);

  const start = (state?: StateValue | State) => service.start(state);
  const stop = () => service.stop();

  const useSelector = <T = State>(
    selector?: (emitted: State) => T,
    compare?: (a: T, b: T) => boolean,
  ) => {
    return _useSelector(service, selector, compare);
  };

  const useContext = <T = TContext>(
    selector?: (emitted: TContext) => T,
    compare?: (a: T, b: T) => boolean,
  ) => {
    const _selector = (state: State) => {
      if (selector) return selector(state.context);
      return state.context as unknown as T;
    };
    return useSelector(_selector, compare);
  };

  const useMatches = (...values: UseMatchesProps<TResolvedTypesMeta>) => {
    return useSelector(({ value }) => {
      const fn = matches(value);
      return fn(...values);
    });
  };

  const useHasTags = (...tags: Tags) => {
    return useSelector(({ hasTag }) =>
      tags.every(tag => hasTag(tag as string)),
    );
  };

  const send = service.send;

  const sender = <T extends TEvents['type']>(type: T) => {
    // #region Type
    type E = Required<TEvents> extends { type: T } & infer U
      ? LengthOf<TuplifyUnion<Extract<U, { type: T }>>> extends 0
        ? []
        : [Omit<Extract<TEvents, { type: T }>, 'type'>]
      : never;
    // #endregion

    const fn = (...[event]: E) => send({ type, ...event } as any);
    return fn;
  };

  return {
    start,
    send,
    sender,
    stop,
    useSelector,
    useContext,
    useMatches,
    useHasTags,
  };
}
