import * as fs from "node:fs";
import { resolve as resolvePath } from "node:path";

const inputFilePath = resolvePath(__dirname, "./dna_conversion_samples/input");
const fileTimestamp = new Date().toISOString().replace(/[:\-T\.Z]/g, "");
const outputFilePath = resolvePath(
  __dirname,
  `./dna_conversion_samples/output_${fileTimestamp}`
);

const qualityOffset = 33;
const BinaryToDNAMap = {
  "00": "A",
  "01": "C",
  "10": "G",
  "11": "T",
};
type BinaryKey = keyof typeof BinaryToDNAMap;

const encodeQuality = (binaryQuality: string): string => {
  const numericValue = parseInt(binaryQuality, 2);
  return String.fromCharCode(numericValue + qualityOffset);
};

export const formatEntry = (fragment: Buffer, entryIndex: number): string => {
  let dna = "";
  let quality = "";

  fragment.forEach((byte) => {
    const binaryString = byte.toString(2).padStart(8, "0");
    const key = binaryString.substring(0, 2);
    if (!(key in BinaryToDNAMap)) {
      throw new Error(
        `Invalid key '${key}' encountered. These keys are supported: ${Object.keys(
          BinaryToDNAMap
        )}`
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

export const convertDNAsequence = () => {
  const L = 7;
  let entryIndex = 1;
  const inputStream = fs.createReadStream(inputFilePath);
  const outputStream = fs.createWriteStream(outputFilePath);

  inputStream.on("data", (chunk) => {
    for (let i = 0; i < chunk.length; i += L) {
      const fragment = chunk.slice(i, i + L);
      if (typeof fragment === "string") {
        throw new Error("Invalid input. Fragment is not buffer");
      }
      const entry = formatEntry(fragment, entryIndex);
      entryIndex++;
      outputStream.write(entry);
    }
  });

  inputStream.on("close", () => {
    console.log("Transformation completed.");
    outputStream.end();
  });
};

convertDNAsequence();

//ssetrereni vstupu
//odebrat exporty tam kde netreba
//testy
//parametrizovat
//readme
