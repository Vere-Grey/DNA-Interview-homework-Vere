import * as fs from 'node:fs';
import { resolve as resolvePath } from 'node:path';

const fileTimestamp = new Date().toISOString().replace(/[:\-T\.Z]/g, '');
const outputFilePath = resolvePath(
  __dirname,
  `./dna_conversion_samples/output_${fileTimestamp}`,
);

const qualityOffset = 33;
const BinaryToDNAMap = {
  '00': 'A',
  '01': 'C',
  '10': 'G',
  '11': 'T',
};
type BinaryKey = keyof typeof BinaryToDNAMap;

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
    if (!(key in BinaryToDNAMap)) {
      throw new Error(
        `Invalid key '${key}' encountered. These keys are supported: ${Object.keys(
          BinaryToDNAMap,
        )}`,
      );
    }
    dna += BinaryToDNAMap[key as BinaryKey];
    quality += encodeQuality(binaryString.substring(2));
  });

  return `@READ_${entryIndex}
${dna}
+READ_${entryIndex}
${quality}\n`;
};

export const convertDNAsequence = (
  inputFilePath: string,
  fragmentLengthL: number,
) => {
  let entryIndex = 1;
  const inputStream = fs.createReadStream(inputFilePath);
  const outputStream = fs.createWriteStream(outputFilePath);

  inputStream.on('data', (chunk) => {
    for (let i = 0; i < chunk.length; i += fragmentLengthL) {
      const fragment = chunk.slice(i, i + fragmentLengthL);
      if (typeof fragment === 'string') {
        throw new Error('Invalid input. Fragment is not buffer');
      }
      const entry = formatEntry(fragment, entryIndex);
      entryIndex++;
      process.stdout.write(entry);
      outputStream.write(entry);
    }
  });

  inputStream.on('close', () => {
    console.log('Transformation completed.');
    outputStream.end();
  });
};

function main() {
  if (process.argv.length !== 4) {
    throw new Error(
      `Invalid number of arguments ${process.argv.length}. Expected exactly two arguments: inputPath and fragmentLengthL.`,
    );
  }

  const inputPath = process.argv[2];
  const fragmentLengthL = parseInt(process.argv[3], 10);

  if (!fs.existsSync(inputPath)) {
    throw new Error(`File '${inputPath}' does not exist.`);
  }

  try {
    fs.accessSync(inputPath, fs.constants.R_OK);
  } catch (err) {
    throw new Error(`No read access to '${inputPath}'.`);
  }

  const stats = fs.statSync(inputPath);
  if (stats.size === 0) {
    throw new Error(`File '${inputPath}' is empty.`);
  }

  if (!Number(process.argv[3])) {
    throw new Error(`Invalid input fragment length '${process.argv[3]}'.`);
  }

  if (fragmentLengthL <= 0 || fragmentLengthL > stats.size) {
    throw new Error(`Invalid input fragment length '${fragmentLengthL}'.`);
  }

  convertDNAsequence(inputPath, fragmentLengthL);
}

if (require.main === module) {
  main();
}

//TODO: testy
//TODO: readme
