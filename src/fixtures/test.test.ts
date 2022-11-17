import { createModel } from '@xstate/test';
import { describe, test } from 'vitest';
import { AnyStateMachine, interpret } from 'xstate';
import { TContext, TestContext, testmachine } from './test.machine';

const model = createModel<TestContext, TContext>(
  testmachine as AnyStateMachine,
).withEvents({
  CLICK: ({ send }) => {
    send('CLICK');
  },
});

const testPlans = model.getShortestPathPlans({
  filter: state => state.context.testIterator < 2,
});

testPlans.forEach(plan => {
  describe(plan.description, () => {
    plan.paths.forEach(path => {
      test.concurrent(path.description, () => {
        const service = interpret(
          testmachine,
          {},
        ).start() as unknown as TestContext;

        path.test(service);
      });
    });
  });
});
