import * as fs from "node:fs";
import { resolve as resolvePath } from "node:path";

const inputFilePath = resolvePath(__dirname, "./dna_conversion_samples/input");
const timestamp = new Date().toISOString().replace(/[:\-T\.Z]/g, '')
const outputFilePath = resolvePath(__dirname, `./dna_conversion_samples/output_${timestamp}`);

export const helloWorld = () => {
  const output = "Hello World";
  console.log(output);
  return output;
};

export const formatEntry = (entry: string): string => {
  return 'pes'
}

export const convertDNAsequence = () => {
  const L = 2;
  const inputStream = fs.createReadStream(inputFilePath);
  const outputStream = fs.createWriteStream(outputFilePath)

  inputStream.on("data", (chunk) => {
    for (const byte of chunk) {
      outputStream.write(byte.toString(2).padStart(8, "0") + " ");
    }
  });

  inputStream.on("close", () => {
    console.log("Finished reading the file");
    outputStream.end(); 
  });
};

convertDNAsequence();


//ssetrereni vstupu
//odebrat exporty tam kde netreba
//testy
//parametrizovat
//readme