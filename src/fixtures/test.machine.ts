import { assign, createMachine, Interpreter } from 'xstate';

export type TContext = { testIterator: number };
type TEvents = { type: 'CLICK' };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TestContext = Interpreter<TContext, any, TEvents>;

export const testmachine = createMachine(
  {
    predictableActionArguments: true,
    initial: 'off',
    tsTypes: {} as import('./test.machine.typegen').Typegen0,
    schema: {
      events: {} as TEvents,
      context: {} as TContext,
    },
    context: {
      testIterator: 0,
    },

    states: {
      on: {
        on: { CLICK: { target: 'off', actions: 'iterate' } },
      },
      off: {
        on: { CLICK: { target: 'on', actions: 'iterate' } },
        tags: 'busy',
      },
    },
  },
  {
    actions: {
      iterate: assign({
        testIterator: ({ testIterator }) => testIterator + 1,
      }),
    },
  },
);

export type TestMachine = typeof testmachine;
