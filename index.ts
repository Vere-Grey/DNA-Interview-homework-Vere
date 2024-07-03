import {
  createReadStream,
  accessSync,
  constants,
  statSync,
  existsSync,
} from 'node:fs';
import { resolve as resolvePath } from 'node:path';

const qualityOffset = 33;
const binaryToDNAMap = {
  '00': 'A',
  '01': 'C',
  '10': 'G',
  '11': 'T',
};
type BinaryKey = keyof typeof binaryToDNAMap;

const encodeQuality = (binaryQuality: string): string => {
  const numericValue = parseInt(binaryQuality, 2);
  return String.fromCharCode(numericValue + qualityOffset);
};

export const formatEntry = (fragment: Buffer, entryIndex: number): string => {
  let dna = '';
  let quality = '';

  fragment.forEach((byte) => {
    const binaryString = byte.toString(2).padStart(8, '0');
    const key = binaryString.substring(0, 2);
    if (!(key in binaryToDNAMap)) {
      throw new Error(
        `Invalid key '${key}' encountered. These keys are supported: ${Object.keys(
          binaryToDNAMap,
        )}`,
      );
    }
    dna += binaryToDNAMap[key as BinaryKey];
    quality += encodeQuality(binaryString.substring(2));
  });

  return `@READ_${entryIndex}
${dna}
+READ_${entryIndex}
${quality}\n`;
};

export const convertDNAsequence = (
  inputFullPath: string,
  fragmentLengthL: number,
) => {
  return new Promise<void>((resolve, reject) => {
    let entryIndex = 1;
    const inputStream = createReadStream(inputFullPath);

    inputStream.on('data', (chunk) => {
      for (let i = 0; i < chunk.length; i += fragmentLengthL) {
        const fragment = chunk.slice(i, i + fragmentLengthL);
        if (typeof fragment === 'string') {
          throw new Error('Invalid input. Fragment is not buffer');
        }
        const entry = formatEntry(fragment, entryIndex);
        entryIndex++;
        process.stdout.write(entry);
      }
    });

    inputStream.on('error', (err) => {
      reject(err);
    });

    inputStream.on('close', () => {
      resolve();
    });
  });
};

export function main() {
  if (process.argv.length !== 4) {
    throw new Error(
      `Invalid number of arguments ${process.argv.length}. Expected exactly two arguments: inputPath and fragmentLengthL.`,
    );
  }

  const inputPath = process.argv[2]
  const inputFullPath = resolvePath(__dirname, inputPath);
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
    throw new Error(`Invalid input fragment length '${fragmentLengthL}'.`);
  }

  convertDNAsequence(inputFullPath, fragmentLengthL);
}

if (require.main === module) {
  main();
}

//TODO: testy
//TODO: readme
