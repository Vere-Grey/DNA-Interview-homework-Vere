import { readFileSync } from 'node:fs';
import captureStdout from './stdoutCapture';
import { formatFragment } from '../src/format-fragment';
import { processDNASequence } from '../src/process-dna-sequence';
import { FragmentHandler } from '../src/fragment-handler';
import {
  indexFiveFragmentExpectedOutput,
  output15Path,
  output7Path,
  output80Path,
  twoFragmentExpectedOutput,
  validInputFilePath,
} from './paths-outputs';

describe('Tests fragment formatting', () => {
  it('formats entry from a fragment', () => {
    const fragment = Buffer.from([0x00, 0xe0, 0xc1, 0x7f]);
    const entryIndex = 5;
    expect(formatFragment(fragment, entryIndex)).toStrictEqual(
      indexFiveFragmentExpectedOutput,
    );
  });
});

describe('Tests processing DNA sequence', () => {
  let stdoutCapture: ReturnType<typeof captureStdout>;

  beforeEach(() => {
    stdoutCapture = captureStdout();
  });

  afterEach(() => {
    stdoutCapture.restore();
  });

  it('processes two fragments', () => {
    const fragmentHandler = new FragmentHandler(2);
    const chunk = Buffer.from([0x00, 0xe0, 0xc1, 0x7f]);
    fragmentHandler.processFragments(chunk);
    expect(stdoutCapture.getOutput()).toEqual(twoFragmentExpectedOutput);
  });

  it('converts DNA sequence - L=7', async () => {
    await processDNASequence(validInputFilePath, 7);
    const expectedOutput = readFileSync(output7Path, 'utf8');
    expect(stdoutCapture.getOutput()).toEqual(expectedOutput);
  });

  it('converts DNA sequence - L=15', async () => {
    await processDNASequence(validInputFilePath, 15);
    const expectedOutput = readFileSync(output15Path, 'utf8');
    expect(stdoutCapture.getOutput()).toEqual(expectedOutput);
  });

  it('converts DNA sequence - L=80', async () => {
    await processDNASequence(validInputFilePath, 80);
    const expectedOutput = readFileSync(output80Path, 'utf8');
    expect(stdoutCapture.getOutput()).toEqual(expectedOutput);
  });
});
