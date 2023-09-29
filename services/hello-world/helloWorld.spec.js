import { helloWorld } from './helloWorld';

describe('helloWorld function', () => {
  it('should return the expected Hello World message', async () => {
    const result = await helloWorld();
    expect(result.message).toBe('Hello World');
  });
});
