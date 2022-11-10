/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef } from 'react';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';
import type {
  AnyState,
  EventObject,
  Interpreter,
  State,
  StateFrom,
  Typestate,
} from 'xstate';
import { defaultCompare, defaultSelector, getSnapShot } from './utils';

export default function useSelector<
  TContext extends object,
  TEvents extends EventObject = EventObject,
  TTypestate extends Typestate<TContext> = {
    value: any;
    context: TContext;
  },
  T = State<TContext, TEvents, any, TTypestate>,
>(
  service: Interpreter<TContext, any, TEvents, TTypestate, any>,
  selector: (
    emitted: StateFrom<
      Interpreter<TContext, any, TEvents, TTypestate, any>['machine']
    >,
  ) => T = defaultSelector,
  compare: (a: T, b: T) => boolean = defaultCompare,
): T {
  const initialStateCacheRef = useRef<AnyState>();

  // #region Hooks
  const subscribe = useCallback(
    (handleStoreChange: any) => {
      const { unsubscribe } = service.subscribe(handleStoreChange);
      return unsubscribe;
    },
    [service],
  );

  const boundGetSnapshot = useCallback(() => {
    return getSnapShot<TContext, TEvents, TTypestate>(
      service,
      initialStateCacheRef,
    );
  }, [service]);
  // #endregion

  const selectedSnapshot = useSyncExternalStoreWithSelector(
    subscribe,
    boundGetSnapshot,
    boundGetSnapshot,
    selector,
    compare,
  );

  selectedSnapshot; //?

  return selectedSnapshot;
}
