import { main } from '../src/index';
import { validInputFilePath } from './paths-outputs';

describe('Tests input parameters of main function', () => {
  const originalProcessArgv = process.argv;
  const originalConsoleLog = console.log;
  let consoleOutput: string[] = [];
  const mockConsoleLog = (output: string) => consoleOutput.push(output);

  beforeAll(() => {
    console.log = mockConsoleLog;
  });

  beforeEach(() => {
    consoleOutput = [];
  });

  afterEach(() => {
    process.argv = originalProcessArgv;
    console.log = originalConsoleLog;
  });

  it('throws an error for invalid number of arguments', () => {
    process.argv = ['node', 'index.ts'];
    expect(main).toThrow(
      'Invalid number of arguments 2. Expected exactly two arguments: inputPath and fragmentLengthL.',
    );
  });

  it('throws an error if the file does not exist', () => {
    process.argv = ['node', 'index.ts', 'nonExistent', '7'];
    expect(main).toThrow("File 'nonExistent' does not exist.");
  });

  //TODO: Use jest mock or mock-fs to test this
  it.todo('throws an error if there is no read access to the file');

  it('throws an error if the file is empty', () => {
    process.argv = ['node', 'index.ts', './tests/empty', '7'];
    expect(main).toThrow("File './tests/empty' is empty.");
  });

  it('throws an error if the fragment length is not a number', () => {
    process.argv = ['node', 'index.ts', validInputFilePath, 'abc'];
    expect(main).toThrow("Invalid input fragment length 'abc'.");
  });

  it('throws an error if the fragment length is 0', () => {
    process.argv = ['node', 'index.ts', validInputFilePath, '0'];
    expect(main).toThrow("Invalid input fragment length '0'.");
  });

  it('throws an error if the fragment length is less than 0', () => {
    process.argv = ['node', 'index.ts', validInputFilePath, '-15'];
    expect(main).toThrow("Invalid input fragment length '-15'.");
  });
});
