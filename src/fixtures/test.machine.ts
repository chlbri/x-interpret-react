import { createMachine } from 'xstate';
export const testmachine = createMachine({
  predictableActionArguments: true,
  initial: 'off',
  tsTypes: {} as import('./test.machine.typegen').Typegen0,
  schema: {
    events: {} as { type: 'CLICK' },
    context: {},
  },
  context: {},
  states: {
    on: { on: { CLICK: 'off' } },
    off: { on: { CLICK: 'on' } },
  },
});
