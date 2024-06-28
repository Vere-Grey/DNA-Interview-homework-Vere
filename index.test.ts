import { helloWorld } from './index';

it('greets the world', () => {
  expect(helloWorld()).toBe('Hello World');
});