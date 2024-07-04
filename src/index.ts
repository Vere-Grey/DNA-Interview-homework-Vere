import { accessSync, constants, statSync, existsSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';
import { processDNASequence } from './process-dna-sequence';

export function main() {
  if (process.argv.length !== 4) {
    throw new Error(
      `Invalid number of arguments ${process.argv.length}. Expected exactly two arguments: inputPath and fragmentLengthL.`,
    );
  }

  const inputPath = process.argv[2];
  const inputFullPath = resolvePath(process.cwd(), inputPath);
  const fragmentLengthL = parseInt(process.argv[3], 10);

  if (!existsSync(inputFullPath)) {
    throw new Error(`File '${inputPath}' does not exist.`);
  }

  try {
    accessSync(inputFullPath, constants.R_OK);
  } catch (err) {
    throw new Error(`No read access to '${inputPath}'.`);
  }

  const stats = statSync(inputFullPath);
  if (stats.size === 0) {
    throw new Error(`File '${inputPath}' is empty.`);
  }

  if (!Number(process.argv[3])) {
    throw new Error(`Invalid input fragment length '${process.argv[3]}'.`);
  }

  if (fragmentLengthL <= 0 || fragmentLengthL > stats.size) {
    throw new Error(`Invalid input fragment length '${fragmentLengthL}'. Minimum is 1 a Max allowed is ${stats.size}`);
  }

  processDNASequence(inputFullPath, fragmentLengthL);
}

if (require.main === module) {
  main();
}
