import { FragmentHandler } from '../src/fragment-handler';
import { formatFragment } from '../src/format-fragment';

jest.mock('../format-fragment', () => ({
  formatFragment: jest
    .fn()
    .mockImplementation(
      (fragment, index) => `Formatted ${index}: ${fragment.toString()}\n`,
    ),
}));

describe('Tests fragment processing', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    spy = jest.spyOn(process.stdout, 'write').mockImplementation();
    jest.clearAllMocks();
  });

  afterEach(() => {
    spy.mockRestore();
  });

  it('initializes properties correctly', () => {
    const fragmentLength = 5;
    const fragmentHandler = new FragmentHandler(fragmentLength);
    expect(fragmentHandler.getIncompleteFragment().length).toBe(0);
    expect(fragmentHandler['entryIndex']).toBe(1);
    expect(fragmentHandler['fragmentLengthL']).toBe(fragmentLength);
  });

  it('processes complete fragments correctly', () => {
    const fragmentHandler = new FragmentHandler(5);
    const completeFragment = Buffer.from('1234567890');
    fragmentHandler.processFragments(completeFragment);
    expect(formatFragment).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith('Formatted 1: 12345\n');
    expect(spy).toHaveBeenCalledWith('Formatted 2: 67890\n');
  });

  it('handles incomplete fragments correctly', () => {
    const fragmentHandler = new FragmentHandler(5);
    const incompleteFragment = Buffer.from('123');
    fragmentHandler.processFragments(incompleteFragment);
    expect(fragmentHandler.getIncompleteFragment().toString()).toBe('123');
  });

  it('combines chunks with incomplete fragments correctly', () => {
    const fragmentHandler = new FragmentHandler(5);
    fragmentHandler.setIncompleteFragment(Buffer.from('12'));
    const newChunk = Buffer.from('34567890');
    fragmentHandler.processFragments(newChunk);
    expect(formatFragment).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith('Formatted 1: 12345\n');
    expect(spy).toHaveBeenCalledWith('Formatted 2: 67890\n');
  });

  it('clears incomplete fragments correctly', () => {
    const fragmentHandler = new FragmentHandler(5);
    fragmentHandler.setIncompleteFragment(Buffer.from('123'));
    fragmentHandler.clearIncompleteFragment();
    expect(fragmentHandler.getIncompleteFragment().length).toBe(0);
  });

  it('processes incomplete fragment at end correctly', () => {
    const fragmentHandler = new FragmentHandler(5);
    fragmentHandler.setIncompleteFragment(Buffer.from('123'));
    fragmentHandler.processLeftoverIncompleteFragment();
    expect(formatFragment).toHaveBeenCalledWith(Buffer.from('123'), 1);
    expect(spy).toHaveBeenCalledWith('Formatted 1: 123\n');
  });
});
