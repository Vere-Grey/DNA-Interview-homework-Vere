import { formatEntry, convertDNAsequence } from '../index';
import { resolve as resolvePath } from 'node:path';
import { readFileSync } from 'node:fs';
import captureStdout from './stdoutCapture';

export const validInputFilePath = resolvePath(__dirname, `../dna_conversion_samples/input`);
const output7Path = resolvePath(__dirname, `../dna_conversion_samples/output7`);
const output15Path = resolvePath(
  __dirname,
  `../dna_conversion_samples/output15`,
);
const output80Path = resolvePath(
  __dirname,
  `../dna_conversion_samples/output80`,
);

describe('Tests formatEntry method', () => {
  it('formats entry from a fragment', () => {
    const fragment = Buffer.from([0x00, 0xe0, 0xc1, 0x7f]);
    const entryIndex = 1;
    const expectedEntry = `@READ_${entryIndex}
ATTC
+READ_${entryIndex}
!A"\`
`;
    expect(formatEntry(fragment, entryIndex)).toStrictEqual(expectedEntry);
  });
});

describe('Tests convertDNAsequence method', () => {
  let stdoutCapture: ReturnType<typeof captureStdout>;

  beforeEach(() => {
    stdoutCapture = captureStdout();
  });

  afterEach(() => {
    stdoutCapture.restore();
  });

  it('converts DNA sequence - L=7', async () => {
    await convertDNAsequence(validInputFilePath, 7);
    const expectedOutput = readFileSync(output7Path, 'utf8');
    expect(stdoutCapture.getOutput()).toEqual(expectedOutput);
  });

  it('converts DNA sequence - L=15', async () => {
    await convertDNAsequence(validInputFilePath, 15);
    const expectedOutput = readFileSync(output15Path, 'utf8');
    expect(stdoutCapture.getOutput()).toEqual(expectedOutput);
  });

  it('converts DNA sequence - L=80', async () => {
    await convertDNAsequence(validInputFilePath, 80);
    const expectedOutput = readFileSync(output80Path, 'utf8');
    expect(stdoutCapture.getOutput()).toEqual(expectedOutput);
  });
});
