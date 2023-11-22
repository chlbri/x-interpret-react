import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import { testmachine } from './fixtures/test.machine';
import createSignal from './signal';

describe('01 -> Acceptation', () => {
  const service = createSignal(testmachine);
  const expectFn = (arg: unknown) => expect(arg).toBeInstanceOf(Function);

  test.concurrent('01 -> start is function', () => {
    expectFn(service.start);
  });

  test.concurrent('02 -> stop is function', () => {
    expectFn(service.stop);
  });

  test.concurrent('03 -> sender is function', () => {
    expectFn(service.sender);
  });

  test.concurrent('04 -> createSelector is function', () => {
    expectFn(service.createSelector);
  });

  test.concurrent('05 -> createContextSelector is function', () => {
    expectFn(service.createContextSelector);
  });

  test.concurrent('06 -> computed is function', () => {
    expectFn(service.computed);
  });

  test.concurrent('07 -> context is function', () => {
    expectFn(service.context);
  });

  test.concurrent('08 -> matches is function', () => {
    expectFn(service.matches);
  });

  test.concurrent('09 -> hasTags is function', () => {
    expectFn(service.hasTags);
  });
});

describe('02 -> Workflows', () => {
  const useWorkflow = () => {
    const service = createSignal(testmachine);
    const spyStart = vi.spyOn(service, 'start');
    const spySend = vi.spyOn(service, 'send');
    const spySender = vi.spyOn(service, 'sender');
    const spyStop = vi.spyOn(service, 'stop');
    const spyCreateSelector = vi.spyOn(service, 'createSelector');
    const spyCreateContextSelector = vi.spyOn(
      service,
      'createContextSelector',
    );
    const spyComputed = vi.spyOn(service, 'computed');
    const spyContext = vi.spyOn(service, 'context');
    const spyMatches = vi.spyOn(service, 'matches');
    const spyHasTags = vi.spyOn(service, 'hasTags');
    const iteratorSelector = service.createContextSelector(
      ({ testIterator: iterator }) => iterator,
    );

    const iterator = service.computed(iteratorSelector);

    beforeAll(() => {
      service.start();
    });

    afterAll(() => {
      [
        spySend,
        spySender,
        spyCreateSelector,
        spyCreateContextSelector,
        spyHasTags,
        spyComputed,
        spyMatches,
        spyContext,
      ].forEach(fn => fn.mockReset());
      service.stop();
    });

    return {
      spyStart,
      spySend,
      spySender,
      spyStop,
      spyCreateSelector,
      spyCreateContextSelector,
      spyHasTags,
      spyComputed,
      spyMatches,
      spyContext,
      iterator,
      service,
    };
  };

  describe.concurrent('Workflow #1', () => {
    const {
      spyStart,
      spySend,
      spyComputed,
      spySender,
      spyContext,
      iterator,
      service,
    } = useWorkflow();

    test('01 -> Start is called', () => {
      expect(spyStart).toBeCalledTimes(1);
    });

    test('02 -> At start, iterator is "0"', () => {
      const _iterator = iterator();
      expect(_iterator).toBe(0);
    });

    test('03 -> State is off', () => {
      const _match = service.matches('off')();
      expect(_match).toBe(true);
    });

    test('04 -> Send CLICK', () => {
      service.send('CLICK');
    });

    test('05 -> Iterator is "1"', () => {
      const _state = service.computed()();
      const _iterator = _state.context.testIterator;
      expect(_iterator).toBe(1);
    });

    test('06 -> State is on', () => {
      const _match = service.matches('on')();
      expect(_match).toBe(true);
    });

    test('07 -> Sender and CLICK', () => {
      const send = service.sender('CLICK');
      send();
    });

    test('08 -> State is off', () => {
      const _match = service.matches('off')();
      expect(_match).toBe(true);
    });

    test('09 -> Iterator is "2"', () => {
      const _iterator = service.context(data => data.testIterator)();
      expect(_iterator).toBe(2);
    });

    describe('10 -> Functions calls', () => {
      test('01 -> Send is called once', () => {
        expect(spySend).toBeCalledTimes(1);
      });

      test('02 -> Sender is called once', () => {
        expect(spySender).toBeCalledTimes(1);
      });

      test('03 -> Context is called once', () => {
        expect(spyContext).toBeCalledTimes(1);
      });

      test('04 -> Computed is called once', () => {
        expect(spyComputed).toBeCalled();
      });
    });
  });

  describe.concurrent('Workflow #2', () => {
    const { service } = useWorkflow();

    test('01 -> The current state has tag "busy"', () => {
      const _hastTag = service.hasTags('busy')();
      expect(_hastTag).toBe(true);
    });
  });
});
