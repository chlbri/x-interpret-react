/* eslint-disable @typescript-eslint/no-explicit-any */
import buildMatches from '@bemedev/x-matches';
import type {
  AreAllImplementationsAssumedToBeProvided,
  BaseActionObject,
  EventObject,
  InterpreterOptions,
  MissingImplementationsError,
  NoInfer,
  Prop,
  ResolveTypegenMeta,
  ServiceMap,
  StateMachine,
  State as StateX,
  TypegenDisabled,
  TypegenEnabled,
  Typestate,
} from 'xstate';
import { interpret } from 'xstate';
import _useSelector from './useSelector';
import { UseMatchesProps, defaultSelector, reFunction } from './utils';

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
    : MissingImplementationsError<TResolvedTypesMeta>,
  options?: InterpreterOptions,
) {
  // #region Types
  type State = StateX<
    TContext,
    TEvents,
    any,
    TTypestate,
    TResolvedTypesMeta
  >;

  type Tags = (TResolvedTypesMeta extends TypegenEnabled
    ? Prop<Prop<TResolvedTypesMeta, 'resolved'>, 'tags'>
    : string)[];

  type StateSelector<T> = (emitted: State) => T;
  type ContextSelector<T> = (emitted: TContext) => T;
  // #endregion

  const service = interpret(machine, options);

  const start = reFunction(service, 'start');
  const stop = reFunction(service, 'stop');

  const createSelector = <T = State>(selector?: StateSelector<T>) => {
    return selector;
  };

  const reducer = <T = State>(selector: StateSelector<T>) => {
    const stateSelector = selector;

    const reduceS = <R = T>(
      selector: (emitted: T) => R = defaultSelector,
    ) => {
      const _selector = createSelector(emitted => {
        const step = stateSelector(emitted);
        return selector(step);
      });

      return _selector;
    };

    return reduceS;
  };

  const createContextSelector = <T = TContext>(
    selector?: ContextSelector<T>,
  ) => {
    const contextReducer = reducer(state => state.context);
    return contextReducer(selector);
  };

  const useSelector = <T = State>(
    selector?: StateSelector<T>,
    compare?: (a: T, b: T) => boolean,
  ) => {
    const _selector = createSelector(selector);
    return _useSelector(service, _selector, compare);
  };

  const useMatches = (...values: UseMatchesProps<TResolvedTypesMeta>) => {
    const valueReducer = reducer(state => state.value);
    const matchSelector = valueReducer(value => {
      const fn = buildMatches(value);
      return fn(...values);
    });
    return useSelector(matchSelector);
  };

  const useHasTags = (...tags: Tags) => {
    const tagSelector = createSelector(state =>
      tags.every(tag => state.hasTag(tag)),
    );
    return useSelector(tagSelector);
  };

  const send = service.send;

  const sender = <T extends TEvents['type']>(type: T) => {
    type E = TEvents extends {
      type: T;
    } & infer U
      ? // eslint-disable-next-line @typescript-eslint/ban-types
        U extends {}
        ? Omit<U, 'type'>
        : never
      : never;

    return (...[event]: E extends never ? [] : [event: E]) => {
      send({ type, ...(event as any) });
    };
  };

  return {
    start,
    send,
    sender,
    stop,
    createSelector,
    createContextSelector,
    reducer,
    useSelector,
    useMatches,
    useHasTags,
  } as const;
}
