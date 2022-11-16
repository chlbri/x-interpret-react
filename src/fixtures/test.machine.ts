import { assign, createMachine } from 'xstate';
export const testmachine = createMachine(
  {
    predictableActionArguments: true,
    initial: 'off',
    tsTypes: {} as import('./test.machine.typegen').Typegen0,
    schema: {
      events: {} as { type: 'CLICK' },
    },
    context: {
      iterator: 0,
    },

    states: {
      on: { on: { CLICK: { target: 'off', actions: 'iterate' } } },
      off: {
        on: { CLICK: { target: 'on', actions: 'iterate' } },
        tags: 'busy',
      },
    },
  },
  {
    actions: {
      iterate: assign({ iterator: ({ iterator }) => iterator + 1 }),
    },
  },
);
