import { act, renderHook } from '@testing-library/react-hooks/native';
import { describe, expect, test } from 'vitest';
import { interpret } from 'xstate';
import { testmachine } from './fixtures/test.machine';
import useSelector from './useSelector';

describe('Workflow', () => {
  const service = interpret(testmachine).start();
  test('First', async () => {
    const { result } = renderHook(
      () => useSelector(service, state => state.value),
      {},
    );
    expect(result.current).toBe('off');

    await act(() => {
      service.send('CLICK');
    });

    expect(result.current).toBe('on');
  });
});
