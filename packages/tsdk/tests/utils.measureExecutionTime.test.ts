import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { measureExecutionTime } from '../src/utils';

describe('measureExecutionTime', () => {
  beforeEach(() => {
    // Mock console.log
    vi.spyOn(console, 'log').mockImplementation(() => {});

    // Mock Date.now to control timing
    vi.spyOn(global.Date, 'now').mockImplementation(() => 1000);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return the result of the executed function', async () => {
    const mockFn = vi.fn().mockResolvedValue('test result');

    const result = await measureExecutionTime('Test Task', mockFn);

    expect(result).toBe('test result');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should log start and successful completion messages', async () => {
    const mockFn = vi.fn().mockResolvedValue('test result');

    // First call returns start time, second call returns end time
    vi.spyOn(global.Date, 'now')
      .mockImplementationOnce(() => 1000)
      .mockImplementationOnce(() => 1500);

    await measureExecutionTime('Test Task', mockFn);

    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenNthCalledWith(1, '⏱️ Test Task');
    expect(console.log).toHaveBeenNthCalledWith(2, '✅ Test Task 500.00ms');
  });

  it('should throw error when the executed function fails', async () => {
    const testError = new Error('Test error');
    const mockFn = vi.fn().mockRejectedValue(testError);

    // First call returns start time, second call returns end time
    vi.spyOn(global.Date, 'now')
      .mockImplementationOnce(() => 1000)
      .mockImplementationOnce(() => 1800);

    await expect(measureExecutionTime('Test Task', mockFn)).rejects.toThrow(testError);

    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenNthCalledWith(1, '⏱️ Test Task');
    expect(console.log).toHaveBeenNthCalledWith(2, '❌ Test Task 800ms');
  });

  it('should respect the indent parameter', async () => {
    const mockFn = vi.fn().mockResolvedValue('test result');

    // First call returns start time, second call returns end time
    vi.spyOn(global.Date, 'now')
      .mockImplementationOnce(() => 1000)
      .mockImplementationOnce(() => 1300);

    await measureExecutionTime('Test Task', mockFn, '  ');

    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenNthCalledWith(1, '  ⏱️ Test Task');
    expect(console.log).toHaveBeenNthCalledWith(2, '  ✅ Test Task 300.00ms');
  });

  it('should handle nested execution timing correctly', async () => {
    // Mock Date.now to return incremental times for nested calls
    vi.spyOn(global.Date, 'now')
      .mockImplementationOnce(() => 1000) // outer start
      .mockImplementationOnce(() => 1100) // inner start
      .mockImplementationOnce(() => 1300) // inner end
      .mockImplementationOnce(() => 1500); // outer end

    const innerFn = vi.fn().mockResolvedValue('inner result');
    const outerFn = vi.fn().mockImplementation(async () => {
      return measureExecutionTime('Inner Task', innerFn, '  ');
    });

    await measureExecutionTime('Outer Task', outerFn);

    expect(console.log).toHaveBeenCalledTimes(4);
    expect(console.log).toHaveBeenNthCalledWith(1, '⏱️ Outer Task');
    expect(console.log).toHaveBeenNthCalledWith(2, '  ⏱️ Inner Task');
    expect(console.log).toHaveBeenNthCalledWith(3, '  ✅ Inner Task 200.00ms');
    expect(console.log).toHaveBeenNthCalledWith(4, '✅ Outer Task 500.00ms');
  });
});
